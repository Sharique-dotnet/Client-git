# Fix Guide: User Profile API Error (500 - userName cannot be null)

## 🐛 The Problem

After successful login, the Angular app calls `GET /api/account/users/me` which returns:
```
500 Internal Server Error
System.ArgumentNullException: Value cannot be null. (Parameter 'userName')
```

**Root Cause:** The `GetCurrentUser()` method in `AccountController.cs` uses `this.User.Identity.Name` which is `null` because the JWT token doesn't contain the proper username claim.

---

## ✅ Solution Options

### **Option 1: Fix API - Add Username Claim to JWT Token (RECOMMENDED)**

The JWT token needs to include the username in the claims so that `this.User.Identity.Name` works correctly.

#### **File:** `AuthorizationController.cs`
#### **Location:** `A4.Empower/A4.Empower/Controllers/AuthorizationController.cs`
#### **Method:** `CreateTicketAsync()` (around line 123)

**Add this code after line 125:**

```csharp
private async Task<AuthenticationTicket> CreateTicketAsync(OpenIddictRequest request, ApplicationUser user)
{
    var principal = await _signInManager.CreateUserPrincipalAsync(user);
    
    // ADD THIS: Ensure the Name claim is set properly
    var identity = (ClaimsIdentity)principal.Identity;
    
    // Add username claim if not present
    if (!identity.HasClaim(c => c.Type == ClaimTypes.Name))
    {
        identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
    }
    
    // Also add as 'name' claim for OpenIddict
    if (!identity.HasClaim(c => c.Type == "name"))
    {
        identity.AddClaim(new Claim("name", user.UserName));
    }
    
    // Rest of the method continues...
```

**Full Fixed Method:**

```csharp
private async Task<AuthenticationTicket> CreateTicketAsync(OpenIddictRequest request, ApplicationUser user)
{
    var principal = await _signInManager.CreateUserPrincipalAsync(user);
    
    // Ensure the Name claim is set properly
    var identity = (ClaimsIdentity)principal.Identity;
    
    // Add username claim if not present
    if (!identity.HasClaim(c => c.Type == ClaimTypes.Name))
    {
        identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
    }
    
    // Also add as 'name' claim for OpenIddict
    if (!identity.HasClaim(c => c.Type == "name"))
    {
        identity.AddClaim(new Claim("name", user.UserName));
    }

    principal.SetScopes(new[]
    {
        Scopes.OpenId,
        Scopes.Email,
        Scopes.Profile,
        Scopes.OfflineAccess,
        Scopes.Roles
    }.Intersect(request.GetScopes()));

    principal.SetDestinations(c =>
    {
        if (c.Type == OpenIddictConstants.Claims.Name)
            return new[] { OpenIddictConstants.Destinations.AccessToken, OpenIddictConstants.Destinations.IdentityToken };

        if (c.Type == ClaimTypes.Name)
            return new[] { OpenIddictConstants.Destinations.AccessToken, OpenIddictConstants.Destinations.IdentityToken };

        if (c.Type == ClaimTypes.NameIdentifier)
            return new[] { OpenIddictConstants.Destinations.AccessToken, OpenIddictConstants.Destinations.IdentityToken };

        if (c.Type == ClaimTypes.Email)
            return new[] { OpenIddictConstants.Destinations.AccessToken, OpenIddictConstants.Destinations.IdentityToken };

        if (c.Type == ClaimTypes.Role)
            return new[] { OpenIddictConstants.Destinations.AccessToken, OpenIddictConstants.Destinations.IdentityToken };

        return new[] { OpenIddictConstants.Destinations.AccessToken };
    });

    // Rest of module permissions code...
    var module = _unitOfWork.ApplicationModule.GetAll();
    // ... (existing code)
    
    return new AuthenticationTicket(principal, new AuthenticationProperties(), OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
}
```

---

### **Option 2: Fix API - Alternative Method in AccountController**

If you can't modify the token creation, fix the `GetCurrentUser()` method to handle null username:

#### **File:** `AccountController.cs`
#### **Method:** `GetCurrentUser()` (around line 42)

**Replace:**
```csharp
[HttpGet("users/me")]
[Produces(typeof(UserViewModel))]
public async Task<IActionResult> GetCurrentUser()
{
    return await GetUserByUserName(this.User.Identity.Name);
}
```

**With:**
```csharp
[HttpGet("users/me")]
[Produces(typeof(UserViewModel))]
public async Task<IActionResult> GetCurrentUser()
{
    // Try to get username from claims
    var userName = this.User.Identity?.Name;
    
    if (string.IsNullOrEmpty(userName))
    {
        // Fallback: Try to get from email claim
        userName = this.User.FindFirst(ClaimTypes.Email)?.Value;
    }
    
    if (string.IsNullOrEmpty(userName))
    {
        // Fallback: Try to get user ID and fetch by ID
        var userId = this.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            return await GetUserById(userId);
        }
    }
    
    if (string.IsNullOrEmpty(userName))
    {
        return BadRequest("Unable to identify current user from token");
    }
    
    return await GetUserByUserName(userName);
}
```

---

### **Option 3: Angular Workaround (TEMPORARY - Already Implemented)**

The Angular app has been updated to make the user profile fetch optional. This allows login to succeed even if the profile fetch fails.

**Status:** ✅ Already implemented in login component

**Code in `login.component.ts`:**
```typescript
this.authService.login({ username, password }).subscribe({
  next: (response) => {
    console.log('Login successful, token received');
    
    // Try to fetch user profile, but don't block login if it fails
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        console.log('User profile loaded:', user);
      },
      error: (err) => {
        console.warn('Could not load user profile, continuing anyway:', err);
      }
    });
    
    // Redirect to dashboard regardless of profile fetch result
    this.router.navigate(['/dashboard']);
  },
  error: (error) => {
    // Handle login error
  }
});
```

---

## 🔧 How to Apply the Fix

### **Step 1: Apply API Fix (Option 1 - Recommended)**

1. **Open:** `A4.Empower/A4.Empower/Controllers/AuthorizationController.cs`

2. **Find:** The `CreateTicketAsync` method (line ~123)

3. **Add:** The username claims code after creating the principal

4. **Save** the file

5. **Rebuild** the API project
   ```bash
   dotnet build
   ```

6. **Restart** the API
   ```bash
   dotnet run
   ```

### **Step 2: Test the Fix**

1. **Login** to the Angular app
2. **Check** browser console - should see:
   ```
   Login successful, token received
   User profile loaded: {user object}
   ```
3. **Verify** no 500 error for `/api/account/users/me`

---

## 🧪 Testing the Token Claims

### **Before Fix:**
Decode the JWT token at [jwt.io](https://jwt.io) - you'll see it's missing the `name` claim:

```json
{
  "sub": "user-guid",
  "email": "user@example.com",
  "role": "Administrator"
  // Missing: "name" claim
}
```

### **After Fix:**
Token should include:

```json
{
  "sub": "user-guid",
  "name": "user@example.com",  // ✅ Added
  "email": "user@example.com",
  "role": "Administrator"
}
```

---

## 📋 Debugging Checklist

- [ ] JWT token contains `name` or `ClaimTypes.Name` claim
- [ ] `this.User.Identity.Name` is not null in API controller
- [ ] `/api/account/users/me` returns 200 OK
- [ ] User profile data is loaded in Angular app
- [ ] No console errors in browser
- [ ] Login redirects to dashboard successfully

---

## 🎯 Current Status

**Angular App:** ✅ Fixed (handles profile fetch failure gracefully)

**API:** ⚠️ Needs fix (add username claim to token)

**Workaround Active:** Yes - login works but user profile is not loaded

**Recommended Action:** Apply **Option 1** (Add username claim to JWT token)

---

## 💡 Why This Happens

OpenIddict and ASP.NET Core Identity don't automatically include the username in the `ClaimTypes.Name` claim. The `CreateUserPrincipalAsync` method creates a principal with various claims, but the `Name` claim might not be set correctly for JWT bearer authentication.

The fix explicitly adds the username as a claim so that:
1. `this.User.Identity.Name` works in controllers
2. The `/api/account/users/me` endpoint can identify the current user
3. Authorization policies that depend on the username work correctly

---

## 📚 Additional Resources

- [OpenIddict Documentation](https://documentation.openiddict.com/)
- [ASP.NET Core Identity Claims](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/claims)
- [JWT Claims Explained](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims)

---

**Last Updated:** December 22, 2025  
**Status:** Documented and ready for API fix implementation
