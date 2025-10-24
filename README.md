# MobileLauncher - React Native Boilerplate

> **Lite Version of [<img src="screenshots/icon.png" alt="AIMobileLauncher Icon" width="32" style="vertical-align:middle;"/> <span style="font-size:1.5em;">AIMobileLauncher</span>](https://www.aimobilelauncher.com/)**  
>
> Explore the full-featured version here:<br>
> <a href="https://www.aimobilelauncher.com/" style="font-size:1.25em; font-weight:bold;">
> <img src="screenshots/icon.png" alt="AIMobileLauncher Icon" width="28" style="vertical-align:middle; margin-right:8px;" /> www.aimobilelauncher.com
> </a>

A comprehensive React Native boilerplate built with Expo, following feature-first architecture principles. This project is a streamlined, lighter version of the AIMobileLauncher, including authentication, onboarding, internationalization, theming, and modern state management.

## 🚀 Features

- **Feature-First Architecture**: Organized by business features rather than technical layers
- **Authentication**: Complete login system with secure token storage
- **Onboarding**: 3-step onboarding flow with questionnaires
- **Internationalization**: English and French language support
- **Theming**: Light/Dark/System theme support with Restyle
- **State Management**: Redux Toolkit with RTK Query
- **Navigation**: React Navigation with type-safe routing
- **UI Components**: Reusable components built with Restyle
- **TypeScript**: Full TypeScript support with strict configuration
- **Secure Storage**: Encrypted storage for sensitive data
- **Performance**: MMKV storage, FlashList, and optimized animations
- **Error Handling**: Global error boundary with recovery mechanisms
- **Analytics**: Built-in logging and analytics service

## 📱 Screenshots

<div align="center">
  <h3>App Flow Overview</h3>
  <p>Experience the complete user journey from onboarding to main features</p>
</div>

### Welcome & Onboarding
<div align="center">
  <img src="screenshots/01-welcome-screen.png" alt="Welcome Screen" width="200" />
  <img src="screenshots/02-onboarding-step1.png" alt="Onboarding Step 1" width="200" />
  <img src="screenshots/03-onboarding-step2.png" alt="Onboarding Step 2" width="200" />
  <img src="screenshots/04-onboarding-step3.png" alt="Onboarding Step 3" width="200" />
</div>

### Authentication & Main Features
<div align="center">
  <img src="screenshots/05-login-screen.png" alt="Login Screen" width="200" />
  <img src="screenshots/06-home-screen.png" alt="Home Screen" width="200" />
  <img src="screenshots/07-todos-screen.png" alt="Todos Screen" width="200" />
</div>

## 📁 Project Structure

```
src/
├── features/                    # Feature-specific code
│   ├── auth/                   # Authentication feature
│   │   ├── api/               # API calls and endpoints
│   │   ├── components/        # Feature-specific components
│   │   ├── hooks/            # Custom hooks
│   │   ├── screens/          # Screen components
│   │   ├── services/         # Business logic
│   │   ├── store/            # State management
│   │   └── types/            # Type definitions
│   ├── onboarding/           # Onboarding flow
│   ├── home/                 # Home screen
│   ├── settings/             # Settings screen
│   └── todos/                # Todos feature
├── navigation/                 # Navigation configuration
│   ├── navigators/           # Navigator components
│   ├── routes.ts             # Route definitions
│   └── routes.types.ts       # Navigation types
├── services/                  # Global services
│   ├── api/                  # API configuration
│   ├── storage/              # Storage services
│   ├── analytics/            # Analytics service
│   └── logging/              # Logging services
├── store/                     # Global store configuration
│   ├── store.ts              # Store setup
│   ├── reducers.ts           # Root reducer
│   └── app.slice.ts          # App-level state
├── ui/                        # Shared UI components
│   ├── components/           # Reusable components
│   ├── style/                # Theme and styling
│   └── tokens/               # Design tokens
├── utils/                     # Utility functions
├── schemas/                   # Data validation schemas
├── config/                    # Configuration files
├── entrypoints/              # App entry points
├── providers/                # App providers
└── locales/                  # Translation files
```

## 🛠️ Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **RTK Query** for API calls
- **React Navigation** for navigation
- **Restyle** for styling and theming
- **React Hook Form** with Zod validation
- **i18next** for internationalization
- **Expo Secure Store** for secure storage
- **MMKV** for high-performance storage
- **Redux Persist** for state persistence
- **Biome** for linting and formatting
- **React Native Reanimated** for animations
- **FlashList** for optimized lists

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mobileLauncherLt
```

2. Install dependencies:
```bash
yarn install
```

3. Start the development server:
```bash
yarn start
```

4. Run on your preferred platform:
```bash
# iOS
yarn ios

# Android
yarn android

# Web
yarn web
```

## 🏗️ Architecture Overview

### Feature-First Structure

Each feature is self-contained with its own:
- **Components**: Feature-specific UI components
- **Screens**: Screen components
- **Hooks**: Custom hooks for business logic
- **Store**: Redux slice and selectors
- **API**: RTK Query endpoints
- **Services**: Business logic services
- **Types**: TypeScript type definitions

### State Management

- **Redux Toolkit**: Modern Redux with less boilerplate
- **RTK Query**: Powerful data fetching and caching
- **Redux Persist**: Automatic state persistence with MMKV
- **Type-safe selectors**: Using createSelector

### Theming System

- **Restyle**: Type-safe styling system
- **Light/Dark themes**: Automatic theme switching
- **System theme**: Follows device theme preference
- **Design tokens**: Consistent spacing, colors, and typography

### Navigation

- **Type-safe navigation**: Full TypeScript support
- **Nested navigators**: Stack → Tab navigation
- **Authentication guards**: Automatic route protection
- **Deep linking**: URL-based navigation support

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=https://your-api-url.com
```

### Path Mapping

The project uses path mapping for clean imports:

```typescript
// Instead of
import { Button } from '../../../ui/components/button';

// Use
import { Button } from '#ui/components/button';
```

### Adding New Features

1. Create feature directory:
```bash
mkdir -p src/features/new-feature/{api,components,hooks,screens,services,store,types}
```

2. Follow the established patterns:
   - Create types in `types/index.ts`
   - Add Redux slice in `store/`
   - Create components in `components/`
   - Add screens in `screens/`
   - Implement hooks in `hooks/`

## 🌐 Internationalization

### Adding New Languages

1. Create translation file in `src/locales/`:
```json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred"
  }
}
```

2. Update `src/config/i18n.ts` to include the new language

### Using Translations

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <Text>{t('common.loading')}</Text>;
};
```

## 🎨 Theming

### Adding New Colors

1. Update `src/ui/tokens/colors.ts`:
```typescript
const palette = {
  // Add new colors
  brand: '#FF6B6B',
};
```

2. Use in components:
```typescript
<Box backgroundColor="brand" />
```

### Creating New Components

```typescript
import { createBox } from '@shopify/restyle';
import { Theme } from '#ui/style/theme';

const StyledComponent = createBox<Theme>();

export const MyComponent = ({ ...props }) => {
  return <StyledComponent {...props} />;
};
```

## 🔐 Authentication

The authentication system includes:
- Secure token storage with Expo Secure Store
- Automatic token refresh
- Login/logout functionality
- Protected routes
- User profile management

### Usage

```typescript
import { useAuth } from '#features/auth';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use authentication state and methods
};
```

## 📱 Navigation

### Adding New Routes

1. Update `src/navigation/routes.ts`:
```typescript
export const routes = {
  // Add new routes
  NewFeature: {
    name: 'NewFeature',
    args: noArgs,
  } as const,
};
```

2. Update navigation types in `src/navigation/routes.types.ts`

## 🗄️ Storage

### Secure Storage

For sensitive data like tokens:

```typescript
import { secureStorage } from '#services/storage/secure-storage';

// Store sensitive data
await secureStorage.setItem('auth_token', token);

// Retrieve sensitive data
const token = await secureStorage.getItem('auth_token');
```

### MMKV Storage

For high-performance storage:

```typescript
import { mmkv } from '#services/storage/mmkv-storage';

// Store data
mmkv.set('user_preferences', JSON.stringify(preferences));

// Retrieve data
const preferences = mmkv.getString('user_preferences');
```

## 🎭 Animations

The project uses React Native Reanimated for smooth animations:

```typescript
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

const MyComponent = () => {
  const scale = useSharedValue(1);
  
  const handlePress = () => {
    scale.value = withSpring(1.2);
  };
  
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      {/* Your content */}
    </Animated.View>
  );
};
```

## 📊 Performance

### FlashList

For optimized list performance:

```typescript
import { FlashList } from '@shopify/flash-list';

const MyList = () => {
  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={100}
    />
  );
};
```

### Performance Monitoring

The project includes built-in performance monitoring:

```typescript
import { logger } from '#services/logging';

// Log performance metrics
logger.logEvent('screen_load_time', {
  screen: 'HomeScreen',
  loadTime: 150,
});
```

## 🧪 Development

### Testing

The project includes comprehensive unit testing with Jest and React Native Testing Library:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

#### Testing Features
- **Unit Tests**: Custom hooks, Redux slices, and utility functions
- **Component Tests**: UI component testing with React Native Testing Library
- **API Tests**: RTK Query endpoint testing
- **Mocking**: Comprehensive mocking for external dependencies
- **Coverage**: 70%+ code coverage requirement

#### Test Structure
```
src/
├── features/
│   └── todos/
│       └── hooks/
│           └── __tests__/
│               └── use-todos.test.ts
└── __tests__/
    └── setup.ts
```

### Linting and Formatting

```bash
# Check for linting issues
yarn lint

# Fix linting issues
yarn lint:fix

# Format code
yarn format

# Fix formatting issues
yarn format:fix
```

### Code Quality

The project uses Biome for:
- Fast linting with TypeScript support
- Code formatting
- Import sorting
- Consistent code style

### Development Rules

Follow the comprehensive development rules outlined in [`ai_articles/app_rules.md`](ai_articles/app_rules.md) to maintain consistency and code quality:

- **Feature-First Architecture**: Organize code by business features
- **UI Component Guidelines**: Use Restyle for styling and follow component patterns
- **State Management**: Use Redux Toolkit and RTK Query patterns
- **Testing Standards**: Maintain 70%+ code coverage with comprehensive tests
- **TypeScript Usage**: Strict typing throughout the application
- **Performance Optimization**: Follow performance best practices

## 📦 Available Scripts

- `yarn start` - Start the Expo development server
- `yarn ios` - Run on iOS simulator
- `yarn android` - Run on Android emulator
- `yarn web` - Run on web browser
- `yarn test` - Run all tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Run tests with coverage report
- `yarn lint` - Check for linting issues
- `yarn lint:fix` - Fix linting issues
- `yarn format` - Format code
- `yarn format:fix` - Fix formatting issues

## 🚀 Deployment

### Building for Production

1. **iOS**:
```bash
expo build:ios
```

2. **Android**:
```bash
expo build:android
```

3. **Web**:
```bash
expo build:web
```

### Environment Configuration

Update `app.json` for production settings:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [React Navigation](https://reactnavigation.org/) for navigation
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management
- [Restyle](https://github.com/Shopify/restyle) for styling
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for animations

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Happy coding! 🎉**
