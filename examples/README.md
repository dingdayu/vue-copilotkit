# CopilotKit Vue Examples

This app is a curated set of practical demos for `@dingdayu/vue-copilotkit-*`.

It demonstrates the current package split:

- `@dingdayu/vue-copilotkit-core` for provider + hooks
- `@dingdayu/vue-copilotkit-ui` for chat UI and `CopilotTextarea`

## Start

```bash
pnpm install
# terminal 1
pnpm -C examples dev:runtime

# terminal 2
pnpm dev
```

Default runtime endpoint: `http://localhost:4000/copilotkit`.

Start the runtime first, then start the Vite app in a second terminal.

## Runtime Configuration

The top toolbar lets you configure:

- runtime URL
- Copilot public API key
- UI language

Stored browser keys:

- `runtimeUrl`
- `apiKey`
- `demo-locale`

## Bilingual Support

The demo supports both Chinese and English using `vue-i18n`.

- Locale storage key: `demo-locale`
- Language switcher: top toolbar

## Routes

- `/` overview
- `/todolist` todo assistant
- `/form` smart form
- `/textarea` email reply assistant
- `/table` table operation assistant
- `/spreadsheet` spreadsheet assistant
- `/presentation` presentation assistant
- `/chat-with-your-data` dashboard data assistant
- `/sdk` components + SDK full demo

## Development Notes

- The demo uses `vue-i18n` for bilingual copy.
- Shared state is handled with `pinia`.
- Global UI styles are imported from `@dingdayu/vue-copilotkit-ui/style.css`.
