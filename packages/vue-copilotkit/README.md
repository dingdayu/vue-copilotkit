# @dingdayu/vue-copilotkit

A Vue implementation based on the React UI library of <a href="https://github.com/CopilotKit/CopilotKit" target="_blank">CopilotKit</a>.

## Install

```bash
pnpm add @dingdayu/vue-copilotkit
```

## Quick usage

```ts
import {
  CopilotKit,
  CopilotPopup,
  CopilotChatMessageView,
  CopilotChatAssistantMessage,
  CopilotChatUserMessage,
  useAgentContext,
  useCopilotTheme,
} from '@dingdayu/vue-copilotkit'
```

Wrap your app with `CopilotKit`, then render components like `CopilotPopup`, `CopilotChat`, `CopilotSidebar`, or `CopilotTextarea` where needed.

`CopilotKit` also accepts UI theme props:

- `theme`
- `themeOverrides`
- `darkMode`

## Styles

- If you import from the package root (`@dingdayu/vue-copilotkit`), styles are already loaded by the entry (`src/index.ts` imports `./style.css`).
- If you only use subpath imports, manually add:

```ts
import '@dingdayu/vue-copilotkit/style.css'
```

## Exports

- Root exports (recommended): `CopilotKit`, `CopilotChat`, `CopilotPopup`, `CopilotSidebar`, `CopilotTextarea`, `CopilotChatMessageView`, `CopilotChatAssistantMessage`, `CopilotChatUserMessage`, `useAgentContext`, `useCopilotTheme`, and common `useXxx` composables.
- Subpath exports:
  - `@dingdayu/vue-copilotkit/components`
  - `@dingdayu/vue-copilotkit/composables`
  - `@dingdayu/vue-copilotkit/types`
  - `@dingdayu/vue-copilotkit/style.css`

## Migration from Legacy Packages

If you are migrating from `@dingdayu/vue-copilotkit-core` or `@dingdayu/vue-copilotkit-ui`:

| Old Import Path                 | New Unified Path           |
| :------------------------------ | :------------------------- |
| `@dingdayu/vue-copilotkit-core` | `@dingdayu/vue-copilotkit` |
| `@dingdayu/vue-copilotkit-ui`   | `@dingdayu/vue-copilotkit` |

**Breaking Changes in `CopilotTextarea`:**
The `autosuggestionsConfig` has been flattened. Instead of nesting under `chatApiConfigs`, you can now pass `suggestionsApiConfig`, `insertionApiConfig`, and `editingApiConfig` directly at the top level of the config object.

```ts
// Old
autosuggestionsConfig: {
  chatApiConfigs: {
    suggestionsApiConfig: { ... }
  }
}

// New (Simplified)
autosuggestionsConfig: {
  suggestionsApiConfig: { ... }
}
```

## Notes

- This repository targets the CopilotKit v2 single-route runtime protocol.
- `useAgentContext({ description, value })` registers contextual app state for the active agent.
- `useCopilotTheme()` exposes `activeThemeName`, `resolvedAppearance`, `setTheme()`, and `setDarkMode()`.
