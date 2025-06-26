// This file provides workspace-specific custom instructions to Copilot.
// For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file

# Nuxt 3 Clean Architecture Workspace
- Use clean architecture principles: core/domain, application, infrastructure, presentation.
- Use Pinia for state, VueUse for utilities, Nuxt Auth for authentication, Axios for API abstraction, Nuxt-i18n for i18n, TailwindCSS for styling.
- Use ESLint, Prettier, Husky, Commitlint for code quality and git hooks.
- Use Vitest and Testing Library for testing.
- .env support is required.
- Example login flow is implemented with separation of service, composable, and store layers.
