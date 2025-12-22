# Empower Client

> A modern Angular 20 admin dashboard application with clean architecture

## 🚀 Features

- ✨ **Clean Architecture**: Feature-based structure with clear separation of concerns
- 🎨 **Modern UI**: Built with Bootstrap 5 and custom themes
- 🔐 **Authentication**: Login with session management and auto-lock
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- ⚡ **Performance**: Lazy loading and standalone components
- 🎯 **TypeScript**: Strong typing throughout the application

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20 or higher)

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/Sharique-dotnet/GradientAble.git

# Navigate to project directory
cd GradientAble

# Install dependencies
npm install
```

## 🏃 Running the Application

```bash
# Development server
npm start

# Open browser
# Navigate to http://localhost:4200
```

## 🔑 Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

---

# 📐 Architecture

## 🎯 Architecture Goals

- **Separation of Concerns**: Clear boundaries between different parts of the application
- **Scalability**: Easy to add new features without affecting existing code
- **Maintainability**: Code organization that makes it easy to find and modify functionality
- **Reusability**: Shared components and utilities that can be used across features
- **Type Safety**: Strong typing with models and interfaces

## 📁 Project Structure

```
src/app/
├── core/                    # App-wide singletons (loaded once)
│   ├── guards/             # Route guards (auth.guard, guest.guard)
│   ├── interceptors/       # HTTP interceptors (future)
│   ├── services/           # Global services
│   ├── models/             # Global models (common.model.ts)
│   ├── constants/          # App constants (app.constants.ts)
│   ├── enums/             # Global enums (future)
│   ├── utils/             # Utility functions (storage.util, date.util)
│   └── core.providers.ts  # Global providers
│
├── shared/                 # Stateless & reusable items
│   ├── ui/                # Reusable UI components
│   │   ├── card/
│   │   ├── breadcrumb/
│   │   └── spinner/
│   ├── pipes/             # Custom pipes (future)
│   ├── directives/        # Custom directives (future)
│   ├── validators/        # Form validators (future)
│   └── shared.imports.ts  # Common imports bundle
│
├── features/              # Business domains
│   ├── auth/
│   │   ├── pages/        # Login, Register, Reset Password
│   │   ├── components/   # Feature-specific components
│   │   ├── services/     # AuthService
│   │   ├── models/       # User models
│   │   └── auth.routes.ts
│   │
│   └── dashboard/
│       ├── pages/        # Overview (home page)
│       ├── components/   # Dashboard-specific components
│       ├── services/     # Dashboard services
│       └── dashboard.routes.ts
│
├── layouts/               # Application shells
│   ├── main-layout/      # Authenticated user layout
│   │   ├── components/  # Nav, Sidebar, Footer, etc.
│   │   └── main-layout.component.ts
│   └── auth-layout/      # Guest/authentication layout
│       └── auth-layout.component.ts
│
├── app.config.ts         # Global configuration & providers
├── app.routes.ts         # Root routing configuration
├── app.component.ts      # Root component
└── app.component.scss
```

## 📦 Folder Responsibilities

### Core (`src/app/core/`)
**Purpose**: App-wide singletons loaded once at startup

**Contains**:
- **Guards**: Route protection logic
- **Interceptors**: HTTP request/response modification
- **Services**: Global services (API service, etc.)
- **Models**: Application-wide interfaces
- **Constants**: Configuration values
- **Utils**: Helper functions (storage, date formatting)

**Rule**: Only import from core in features, never vice versa.

### Shared (`src/app/shared/`)
**Purpose**: Stateless, reusable components and utilities

**Contains**:
- **UI Components**: Card, Breadcrumb, Spinner, etc.
- **Pipes**: Custom data transformation pipes
- **Directives**: Custom attribute/structural directives  
- **Validators**: Form validation functions

**Rule**: Components here should have no business logic.

### Features (`src/app/features/`)
**Purpose**: Business domain logic

**Contains**:
- **Pages**: Route-level components (smart components)
- **Components**: Feature-specific UI (dumb components)
- **Services**: Feature-specific business logic
- **Models**: Feature-specific interfaces
- **Routes**: Feature routing configuration

**Rule**: Features should be independent and not import from each other.

### Layouts (`src/app/layouts/`)
**Purpose**: Application shells/wrappers

**Contains**:
- **Main Layout**: For authenticated users (nav, sidebar, footer)
- **Auth Layout**: For authentication pages (minimal wrapper)

**Rule**: Layouts wrap feature content and handle global UI elements.

## 📝 Import Guidelines

### ✅ Allowed
- Features → Core
- Features → Shared
- Layouts → Shared
- Layouts → Core

### ❌ Not Allowed
- Core → Features
- Core → Shared
- Shared → Features
- Shared → Core
- Features → Other Features

## 🚀 Key Architecture Features

### 1. **Standalone Components**
All components are now standalone, eliminating the need for NgModules.

### 2. **Lazy Loading**
Features are lazy loaded for better performance:
```typescript
loadComponent: () => import('./features/auth/pages/login/login.component')
```

### 3. **Route Guards**
- `authGuard`: Protects routes requiring authentication
- `guestGuard`: Prevents authenticated users from accessing auth pages

### 4. **Feature-based Organization**
Each feature (auth, dashboard) is self-contained with its own:
- Pages (route-level components)
- Components (feature-specific)
- Services
- Models
- Routes

### 5. **Clean Imports**
Using `shared.imports.ts` for common module imports:
```typescript
import { SHARED_IMPORTS } from '../../shared/shared.imports';
```

## 🔧 How to Add a New Feature

1. **Create Feature Folder**:
```bash
mkdir -p src/app/features/my-feature/{pages,components,services,models}
```

2. **Create Feature Routes**:
```typescript
// src/app/features/my-feature/my-feature.routes.ts
export const MY_FEATURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/list/list.component')
  }
];
```

3. **Add to Main Routes**:
```typescript
// src/app/app.routes.ts
{
  path: 'my-feature',
  loadChildren: () => import('./features/my-feature/my-feature.routes')
}
```

---

# 🔧 Development

## Available Scripts

```bash
# Development
npm start              # Start dev server
npm run watch          # Build with watch mode

# Production
npm run build          # Production build
npm run build-prod     # Optimized production build

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint errors
npm run prettier       # Format code

# Testing
npm test               # Run tests
```

## 🎨 Themes & Styling

The application supports multiple themes. Customize themes in:
```
src/scss/
├── settings/     # Variables, mixins
├── themes/       # Theme definitions
└── _index.scss
```

## 🔐 Application Features

### Authentication
- Login page with form validation
- Auto-logout after 10 minutes of inactivity
- Lock screen functionality
- Remember me option
- Session management with localStorage

### Dashboard
- Overview page with welcome message
- Architecture information display
- Customizable widgets (coming soon)
- Real-time updates (coming soon)

### Layouts

#### Main Layout (Authenticated)
- Navigation sidebar
- Top navbar with user menu
- Lock screen option
- Logout functionality
- Footer
- Breadcrumbs

#### Auth Layout (Guest)
- Minimal wrapper for authentication pages
- Centered content
- Gradient background

## 🔐 Security Features

- **Authentication**: Handled by `AuthService`
- **Route Protection**: Using functional guards (`authGuard`, `guestGuard`)
- **Storage**: Utility class for secure localStorage operations
- **Auto-lock**: Automatic screen lock after 10 minutes of inactivity
- **Session Management**: Secure token and user data handling

---

# 🚧 Roadmap

## Current Features ✅
- [x] Clean architecture implementation
- [x] Authentication system
- [x] Dashboard overview
- [x] Lock screen functionality
- [x] Route guards
- [x] Responsive layout

## Planned Features 🔜
- [ ] User management module
- [ ] Profile settings page
- [ ] Real-time notifications
- [ ] Dashboard widgets and charts
- [ ] Data tables with pagination
- [ ] Form builder
- [ ] File upload functionality
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Email templates
- [ ] Reports generation
- [ ] Advanced search

---

# 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

## When Adding New Code

1. Follow the established folder structure
2. Keep components focused and small (Single Responsibility Principle)
3. Use standalone components
4. Implement lazy loading for new features
5. Add proper TypeScript types and interfaces
6. Write meaningful commit messages
7. Update documentation as needed

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request with a clear description

---

# 📚 Resources

- [Angular Documentation](https://angular.dev)
- [Angular Style Guide](https://angular.dev/style-guide)
- [Standalone Components](https://angular.dev/guide/components/importing)
- [Lazy Loading](https://angular.dev/guide/ngmodules/lazy-loading)
- [Route Guards](https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)

---

# 📝 License

This project is private and proprietary.

---

# 👨‍💻 Author

**Sharique Ansari**
- GitHub: [@Sharique-dotnet](https://github.com/Sharique-dotnet)
- Email: shariquedotnet@gmail.com
- Location: Bhiwandi, Maharashtra, India

---

# 🙏 Acknowledgments

- Angular Team for the amazing framework
- Bootstrap Team for the UI components
- All contributors and supporters
- Open source community

---

**Version**: 1.0.0  
**Last Updated**: December 19, 2025  
**Status**: Active Development
