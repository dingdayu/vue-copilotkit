ChangeLog

### 20260306

- 从上游更新代码
- Remove @dingdayu/vue-copilotkit-vite-config package and inline Vite config in each package
- Merge standalone vue-textarea package into @dingdayu/vue-copilotkit-ui
- Migration: import `CopilotTextarea` from `@dingdayu/vue-copilotkit-ui` and keep using `@dingdayu/vue-copilotkit-ui/style.css`
- Migration: run the demo with `pnpm -C examples dev:runtime` and `pnpm dev` in separate terminals
- Refresh root/examples/package README files to match the new package layout and example app flow
- 增加 publish packages to package.json
