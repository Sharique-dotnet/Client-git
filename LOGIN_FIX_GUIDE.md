# Login Fix Guide - User Profile API Error

## 🐛 Issue Description

**Error:** `Failed to load user profile: System.ArgumentNullException: Value cannot be null. (Parameter 'userName')`

**Endpoint:** `GET /api/account/users/me`

**HTTP Status:** 500 Internal Server Error

---

## 🔍 Root Cause

The API endpoint `/api/account/users/me` expects the user's identity name from the JWT token claims:

```csharp
public async Task<IActionResult> GetCurrentUser()
{
    return await GetUserByUserName(this.User.Identity.Name);
}
```

The issue is that `this.User.Identity.Name` is **null** because the JWT token from OpenIddict doesn't have the required claim configured properly.

---

## ✅ Solutions Applied

### Solution 1: Make User Profile Fetch Non-Blocking (Angular)

**Status:** ✅ **FIXED**

Updated the login component to:
- Allow login to succeed even if user profile fetch fails
- Redirect to dashboard regardless of profile load status  
- Log the error but don't block the user

**File:** `src/app/features/auth/pages/login/login.component.ts`

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
    
    // Redirect to dashboard regardless
    this.router.navigate(['/dashboard']);
  },
  error: (error) => {
    // Handle login errors
  }
});
```

---

### Solution 2: Fix API to Use Correct Claim (Recommended)

**Status:** ⏸️ **NEEDS IMPLEMENTATION**

The proper fix is to update the API's `AuthorizationController.cs` to ensure the JWT token includes the correct user identity claim.

**File to Modify:** `A4.Empower/A4.Empower/Controllers/AuthorizationController.cs`

**In `CreateTicketAsync` method (around line 125-164):**

The token already sets these claims:
```csharp
identity.AddClaim(CustomClaimTypes.FullName, user.FullName, Destinations.IdentityToken);
identity.AddClaim(CustomClaimTypes.Email, user.Email, Destinations.IdentityToken);
```

But the issue is that ASP.NET Core Identity expects the **Name claim** to be set using the standard claim type.

**Add this code after line 125:**

```csharp
var principal = await _signInManager.CreateUserPrincipalAsync(user);

// Add the user's email/username as the Name claim for Identity
var identity = principal.Identity as ClaimsIdentity;
if (identity != null && !string.IsNullOrEmpty(user.Email))
{
    // Remove any existing name claim
    var existingNameClaim = identity.FindFirst(Claims.Name);
    if (existingNameClaim != null)
    {
        identity.RemoveClaim(existingNameClaim);
    }
    
    // Add the correct name claim
    identity.AddClaim(new Claim(Claims.Name, user.Email));
}
```

This ensures that `this.User.Identity.Name` will have the user's email in the API.

---

### Solution 3: Alternative API Fix (Simpler)

**Status:** ⏸️ **ALTERNATIVE OPTION**

Modify the `GetCurrentUser()` method in `AccountController.cs` to use a different approach:

**Original Code (Line 44-48):**
```csharp
[HttpGet("users/me")]
[Produces(typeof(UserViewModel))]
public async Task<IActionResult> GetCurrentUser()
{
    return await GetUserByUserName(this.User.Identity.Name);
}
```

**Updated Code:**
```csharp
[HttpGet("users/me")]
[Produces(typeof(UserViewModel))]
public async Task<IActionResult> GetCurrentUser()
{
    // Try to get user ID from claims first
    var userId = this.User.FindFirst(Claims.Subject)?.Value;
    
    if (!string.IsNullOrEmpty(userId))
    {
        return await GetUserById(userId);
    }
    
    // Fallback to username
    var userName = this.User.Identity?.Name;
    if (!string.IsNullOrEmpty(userName))
    {
        return await GetUserByUserName(userName);
    }
    
    // Try email claim as last resort
    var email = this.User.FindFirst(Claims.Email)?.Value ?? 
                this.User.FindFirst(CustomClaimTypes.Email)?.Value;
    
    if (!string.IsNullOrEmpty(email))
    {
        return await GetUserByUserName(email);
    }
    
    return BadRequest("Unable to identify user from token");
}
```

This makes the endpoint more robust by trying multiple claim types.

---

## 🧪 Testing the Fix

### Test Current Solution (Non-Blocking):

1. **Pull latest changes:**
   ```bash
   git pull origin feature/api-integration-setup
   ```

2. **Start the app:**
   ```bash
   ng serve --port=4400
   ```

3. **Login:**
   - Navigate to `http://localhost:4400`
   - Enter credentials
   - Click "Sign In"

4. **Expected Behavior:**
   - ✅ Login succeeds
   - ✅ Token is stored
   - ✅ Redirects to dashboard
   - ⚠️ Console warning: "Could not load user profile, continuing anyway"
   - ✅ User can access the dashboard

### Test After API Fix:

1. **Apply one of the API fixes** (Solution 2 or 3)

2. **Restart API:**
   ```bash
   dotnet run
   ```

3. **Test login again:**
   - Login should succeed
   - User profile should load successfully
   - No errors in console

---

## 🔍 Debugging the Token

To see what claims are in your JWT token:

**Add this to your AuthService after login:**

```typescript
private decodeToken(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    console.log('Decoded JWT token:', decoded);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Call after login:
this.decodeToken(response.access_token);
```

Check the console to see what claims are present. Look for:
- `sub` - User ID
- `name` - User name/email
- `email` - User email
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name` - Standard name claim

---

## 📋 Summary

### What's Working Now:
- ✅ Login authentication works
- ✅ Token is received and stored
- ✅ User is redirected to dashboard
- ✅ Application is usable

### What's Not Working:
- ⚠️ User profile API call fails (but doesn't block app)
- ⚠️ User details not loaded from API

### Recommended Next Steps:

1. **Short-term:** Use current fix (already applied) - app works but profile isn't loaded
2. **Long-term:** Apply **Solution 3** to AccountController.cs for robust user identification
3. **Best practice:** Apply **Solution 2** to ensure proper JWT claims are set

---

## 💡 Additional Notes

### Why the App Still Works:

Even without the user profile, the app can function because:
- Authentication is based on the JWT token
- Token contains user claims (roles, permissions)
- Guards and interceptors use the token, not the user profile object

### When You Need the User Profile:

You'll need to fix the API endpoint when:
- Displaying user info in the UI (name, email, avatar)
- User settings/preferences
- Profile management features

---

**Implementation Date:** December 22, 2025  
**Status:** Temporary fix applied ✅  
**Permanent fix:** Pending API update ⏸️
