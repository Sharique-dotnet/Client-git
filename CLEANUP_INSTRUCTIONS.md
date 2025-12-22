# Cleanup Instructions

## Remove Demo Folder

The `src/app/demo` folder contains demo/example components that are no longer needed. Please remove it manually:

### Using Command Line:

**Windows (PowerShell):**
```powershell
Remove-Item -Recurse -Force src/app/demo
```

**Linux/Mac:**
```bash
rm -rf src/app/demo
```

### Using Git:

```bash
git rm -r src/app/demo
git commit -m "Remove demo folder"
```

## What Has Been Updated

### ✅ Login Functionality Implemented
- Login component now uses real API authentication
- Proper error handling for API responses
- Password visibility toggle added
- Form validation with detailed error messages
- Loading state during authentication
- Auto-redirect to dashboard on successful login

### ✅ Routing Configuration
- Default route redirects to login page for unauthenticated users
- Default route redirects to dashboard for authenticated users
- Auth routes protected with guest guard
- Dashboard routes protected with auth guard

### ✅ Navigation Updated
- Removed demo/sample page routes
- Added proper navigation structure for all modules:
  - Dashboard
  - Employee Management (Employees, Departments, Designations)
  - Leave Management (My Leaves, Leave Requests)
  - Timesheet (My Timesheet, Manage Timesheet)
  - Recruitment (Vacancies, Candidates, Interviews)
  - Performance (My Goals, Review Goals)
  - Expense Management (My Expenses, Approve Expenses)

## Testing the Login

1. **Start the Web API**:
   ```bash
   cd A4.Empower-Git/A4.Empower/A4.Empower
   dotnet run
   ```
   The API should be running at `https://localhost:5001`

2. **Start the Angular App**:
   ```bash
   cd Client-git
   ng serve --port=4400
   ```
   The app will be available at `http://localhost:4400`

3. **Test Login**:
   - Open browser and navigate to `http://localhost:4400`
   - You should be automatically redirected to `/auth/login`
   - Enter credentials (check with API database for valid users)
   - On successful login, you'll be redirected to `/dashboard`

## Default Test Credentials

Check your API database for seeded users. Common defaults might be:
- Username: `admin` or `administrator`
- Password: (check your database seeding configuration)

## Troubleshooting

### Issue: Cannot connect to API
**Solution:** 
- Verify API is running at `https://localhost:5001`
- Check CORS configuration in API `Startup.cs`
- Trust the SSL certificate if using HTTPS locally

### Issue: Login fails with "Invalid credentials"
**Solution:**
- Check that you're using correct username/password from database
- Verify the API's AuthorizationController is accessible
- Check browser console for detailed error messages

### Issue: Redirects to login after successful authentication
**Solution:**
- Check that tokens are being stored in localStorage
- Verify the auth guard is working correctly
- Check browser console for token-related errors

## Next Steps

After removing the demo folder:

1. ✅ Test login functionality
2. ✅ Verify dashboard redirect
3. ⏭️ Implement dashboard overview component
4. ⏭️ Create employee management module
5. ⏭️ Create leave management module
6. ⏭️ Continue with other modules as needed

## File Changes Summary

### Modified Files:
- `src/app/features/auth/pages/login/login.component.ts` - Real API integration
- `src/app/features/auth/pages/login/login.component.html` - Updated UI with password toggle
- `src/app/theme/layout/admin/navigation/navigation.ts` - Updated navigation structure
- `src/environments/environment.ts` - Added appVersion property
- `src/environments/environment.prod.ts` - Added appVersion property

### Files to Delete Manually:
- `src/app/demo/` - Entire folder and contents

### New Files:
- `API_INTEGRATION_SETUP.md` - Complete API integration documentation
- `CLEANUP_INSTRUCTIONS.md` - This file
