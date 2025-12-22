# API Integration Setup Documentation

## Overview
This Angular application is configured to consume the A4.Empower Web API with OAuth2 authentication using OpenIddict.

## Configuration Summary

### Environment Settings

**Development (`environment.ts`)**
- API Base URL: `https://localhost:5001`
- API Endpoint: `https://localhost:5001/api`
- Token Endpoint: `https://localhost:5001/connect/token`
- Token Refresh Interval: 60 seconds (access token expires in 2 minutes)
- App Version: `1.0.0`

**Production (`environment.prod.ts`)**
- API Base URL: `https://api.empower360plus.com`
- API Endpoint: `https://api.empower360plus.com/api`
- Token Endpoint: `https://api.empower360plus.com/connect/token`
- App Version: `1.0.0`

### Environment Configuration Properties

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001',
  apiEndpoint: 'https://localhost:5001/api',
  tokenEndpoint: 'https://localhost:5001/connect/token',
  tokenRefreshInterval: 60000, // 1 minute
  clientId: 'empower-angular-client',
  appName: 'Empower360Plus',
  appVersion: '1.0.0',
  httpRetry: {
    count: 3,
    delay: 1000
  },
  httpTimeout: 30000 // 30 seconds
};
```

## Project Structure

```
src/app/
├── core/
│   ├── constants/         # Application constants
│   ├── guards/           # Route guards (auth guard)
│   ├── interceptors/     # HTTP interceptors
│   │   ├── auth.interceptor.ts       # Adds auth token to requests
│   │   ├── error.interceptor.ts      # Global error handling
│   │   └── loading.interceptor.ts    # Loading state management
│   ├── models/           # TypeScript interfaces/models
│   ├── services/         # Core services
│   │   ├── auth.service.ts           # Authentication service
│   │   ├── storage.service.ts        # Local storage management
│   │   ├── http-base.service.ts      # Base HTTP service
│   │   └── loading.service.ts        # Loading state service
│   └── utils/            # Utility functions
├── features/             # Feature modules
├── shared/               # Shared components and utilities
├── layouts/              # Layout components
└── theme/                # Theme configuration
```

## Core Services Implemented

### 1. **AuthService** (`auth.service.ts`)
Handles user authentication with OpenIddict OAuth2 flow.

**Key Methods:**
- `login(username, password)` - Authenticate user and get tokens
- `logout()` - Clear tokens and user data
- `refreshToken()` - Refresh access token using refresh token
- `isAuthenticated()` - Check if user is authenticated
- `getAccessToken()` - Get current access token
- `getCurrentUser()` - Get current user information

### 2. **StorageService** (`storage.service.ts`)
Manages local storage for tokens and user data.

**Key Methods:**
- `setItem(key, value)` - Store data
- `getItem(key)` - Retrieve data
- `removeItem(key)` - Remove data
- `clear()` - Clear all storage

### 3. **HttpBaseService** (`http-base.service.ts`)
Base service for making HTTP requests to the API.

**Features:**
- Automatic URL construction with base API endpoint
- Generic CRUD operations (GET, POST, PUT, DELETE)
- Error handling
- Type safety with TypeScript generics

### 4. **LoadingService** (`loading.service.ts`)
Manages global loading state for HTTP requests.

## HTTP Interceptors

### 1. **Auth Interceptor**
Automatically adds the Bearer token to all API requests.

```typescript
Authorization: Bearer {access_token}
```

### 2. **Error Interceptor**
Global error handling for HTTP requests:
- 401 Unauthorized: Attempts token refresh, redirects to login on failure
- 403 Forbidden: Shows permission denied message
- 404 Not Found: Shows resource not found message
- 500+ Server Errors: Shows server error message
- Network Errors: Shows connection error message

### 3. **Loading Interceptor**
Automatically shows/hides loading indicator during HTTP requests.

## Authentication Flow

### Login Flow
1. User submits credentials (username/password)
2. Angular app sends POST request to `/connect/token`
3. Request body:
   ```
   grant_type=password&
   username={username}&
   password={password}
   ```
4. API returns:
   ```json
   {
     "access_token": "...",
     "token_type": "Bearer",
     "expires_in": 120,
     "refresh_token": "..."
   }
   ```
5. Tokens are stored in localStorage
6. User is redirected to dashboard

### Token Refresh Flow
1. Token refresh runs automatically every 60 seconds
2. Sends POST request to `/connect/token` with:
   ```
   grant_type=refresh_token&
   refresh_token={refresh_token}
   ```
3. New tokens are stored
4. If refresh fails, user is logged out

### Protected Routes
Use `AuthGuard` to protect routes:

```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }
];
```

## API Service Implementation Pattern

All feature services should extend `HttpBaseService`:

```typescript
import { Injectable } from '@angular/core';
import { HttpBaseService } from '@core/services/http-base.service';
import { Observable } from 'rxjs';

export interface Employee {
  id: string;
  name: string;
  email: string;
  // ... other fields
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends HttpBaseService {
  private endpoint = 'employees';

  getEmployees(): Observable<Employee[]> {
    return this.get<Employee[]>(this.endpoint);
  }

  getEmployee(id: string): Observable<Employee> {
    return this.get<Employee>(`${this.endpoint}/${id}`);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.post<Employee>(this.endpoint, employee);
  }

  updateEmployee(id: string, employee: Employee): Observable<Employee> {
    return this.put<Employee>(`${this.endpoint}/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}
```

## Next Steps

### 1. Create API Services
Create services for each API module:
- EmployeeService
- LeaveService
- TimesheetService
- RecruitmentService
- PerformanceService
- ExpenseService
- etc.

### 2. Define TypeScript Models
Create interfaces matching API DTOs in `core/models/`:
- employee.model.ts
- leave.model.ts
- timesheet.model.ts
- etc.

### 3. Implement Feature Modules
Create feature modules with components:
- Employee Management
- Leave Management
- Timesheet
- Recruitment
- Performance
- Expense Booking

### 4. Setup State Management (Optional)
Consider implementing NgRx or Akita for complex state management.

## Testing the Setup

### Prerequisites
1. Ensure Web API is running on `https://localhost:5001`
2. CORS is properly configured on the API
3. Database is seeded with test users

### Run the Angular App
```bash
cd Client-git
npm install
ng serve --port=4400
```

The app will be available at: `http://localhost:4400`

### Test Authentication
1. Navigate to login page
2. Enter test credentials
3. Verify token is stored in localStorage
4. Verify protected routes are accessible
5. Verify API calls include Authorization header

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
- Verify API CORS configuration allows your Angular app origin (`http://localhost:4400`)
- Check browser console for specific CORS error messages
- Ensure API is running with HTTPS (`https://localhost:5001`)

### Token Issues
- Check token expiration time (2 minutes)
- Verify token refresh is working
- Clear localStorage and try fresh login

### API Connection Issues
- Verify API is running and accessible
- Check environment.ts has correct API URL
- Verify SSL certificate is trusted (for HTTPS)
- Check browser console for network errors

### Compilation Errors
If you see TypeScript compilation errors:
- Ensure all environment properties are defined
- Run `npm install` to install dependencies
- Clear Angular cache: `ng cache clean`

## Security Considerations

1. **Never commit sensitive data** to git (tokens, passwords, etc.)
2. **Use HTTPS** in production
3. **Implement proper token storage** - Consider using httpOnly cookies in production
4. **Set appropriate token lifetimes**
5. **Implement proper error handling** - Don't expose sensitive error details to users
6. **Validate all inputs** on both client and server
7. **Implement CSRF protection** for state-changing operations

## API Endpoints Reference

### Authentication
- POST `/connect/token` - Get access token (login/refresh)

### Core Modules
- `/api/account` - Account management
- `/api/employees` - Employee CRUD
- `/api/departments` - Department management
- `/api/leave` - Leave management
- `/api/timesheet` - Timesheet operations
- `/api/recruitment` - Recruitment module
- `/api/performance` - Performance management
- `/api/expense` - Expense booking
- `/api/salary` - Salary management
- `/api/blogs` - Blog posts

For complete API documentation, visit: `https://localhost:5001/swagger`

## Known Issues & Solutions

### Issue: Missing appVersion in environment
**Solution:** Added `appVersion: '1.0.0'` to both environment.ts and environment.prod.ts

### Issue: SASS deprecation warnings
**Status:** These are warnings from Bootstrap SASS files using deprecated syntax. They don't affect functionality but should be addressed in future updates by migrating to the new SASS module syntax.
