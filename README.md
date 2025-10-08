# Graph UI

This project is a React + TypeScript + Vite app.

## Apollo Client / GraphQL Setup

Apollo Client has been wired into the app. The client reads its GraphQL HTTP endpoint from environment variables with sensible fallbacks so you can run locally and when deployed on Fly.io.

- Preferred: set VITE_GRAPHQL_HTTP to your GraphQL API URL.
- Optional: set VITE_FLY_APP to your Fly app name (defaults to `winegraph`).
- Fallbacks if VITE_GRAPHQL_HTTP isn't set:
  - In production (non-localhost): use same-origin `/graphql`.
  - In development: `http://localhost:4000/graphql`.

### Local development

Create a `.env.local` file at the project root:

```
VITE_GRAPHQL_HTTP=http://localhost:8081/graphql
```

Then start the dev server:

```
npm run dev
```

### Fly deployment

When building for Fly, set the env var at build time to point at your GraphQL endpoint, for example:

```
VITE_GRAPHQL_HTTP=https://<your-api-host>/graphql
```

If you prefer same-origin `/graphql` in production, ensure your Fly nginx (or upstream) proxies `/graphql` to your GraphQL server.

---

Below is the original Vite template README content:

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
