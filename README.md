# Nuxt 3 Clean Architecture Boilerplate

This project demonstrates a Nuxt 3 setup using TypeScript and clean architecture principles. It includes:

- **Pinia** for state management
- **VueUse** for utility functions
- **Nuxt Auth** for authentication
- **Axios** with API abstraction
- **Nuxt-i18n** for internationalization
- **TailwindCSS** for styling
- **ESLint + Prettier + Husky + Commitlint** for code quality and git hooks
- **Vitest + Testing Library** for unit and component testing
- **.env** support for configuration

## Clean Architecture Structure

- `src/core/domain`: Entities and repository interfaces (business logic)
- `src/application/usecases`: Application-specific use cases
- `src/infrastructure/api`: API clients (Axios abstraction)
- `src/infrastructure/services`: Service implementations (e.g., UserService)
- `src/presentation/pages`: UI pages (e.g., login)
- `src/presentation/components`: UI components
- `src/presentation/stores`: Pinia stores
- `src/presentation/composables`: Vue composables

## Example: Login Flow
- **Domain**: `User` entity, `UserRepository` interface
- **Application**: `LoginUseCase` for login logic
- **Infrastructure**: `UserService` implements `UserRepository` using Axios
- **Presentation**: Pinia store, composable, and login page

## Usage

### Local Development
1. Install dependencies: `yarn install`
2. Run dev server: `yarn dev`
3. Lint: `yarn lint`
4. Test: `yarn test`

### Docker Development

#### Prerequisites
- Docker and Docker Compose installed on your system

#### Development with Docker
1. Copy environment file: `cp .env.example .env`
2. Edit `.env` file with your configuration
3. Run development server: `docker-compose -f docker-compose.dev.yml up --build`
4. Access application at `http://localhost:3000`

#### Production with Docker
1. Copy environment file: `cp .env.example .env`
2. Edit `.env` file with production configuration
3. Build and run: `docker-compose up --build -d`
4. Access application at `http://localhost:3000`

#### Docker Commands
```bash
# Development
docker-compose -f docker-compose.dev.yml up --build    # Start dev server
docker-compose -f docker-compose.dev.yml down          # Stop dev server

# Production
docker-compose up --build -d                           # Start production
docker-compose down                                     # Stop production
docker-compose logs -f                                 # View logs

# Rebuild
docker-compose build --no-cache                        # Rebuild images
```

## .env Support
Create a `.env` file in the root with your API base URL:
```
API_BASE=https://your-api-url.com/api
API_EXPORT_BASE=https://your-export-api-url.com/api
```

## Internationalization
Edit `locales/en.json` and `locales/fr.json` for translations.

## Code Quality & Git Hooks
- ESLint and Prettier are pre-configured.
- Husky and Commitlint ensure commit message quality.

## Testing
- Vitest and Testing Library are set up for unit/component tests.

---

**Each layer is documented with sample code. See the `src` folder for details.**
