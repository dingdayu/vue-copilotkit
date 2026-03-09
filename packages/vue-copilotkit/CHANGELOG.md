# @dingdayu/vue-copilotkit

## 1.0.0

### Major Changes

本次更新是一个重要的里程碑，我们对核心 API 进行了简化，并全面升级了项目的自动化基建。

#### 🚀 核心改进 (Core Improvements)

- **API 简化**：展平了 `CopilotTextarea` 的配置结构。现在可以直接在 `autosuggestionsConfig` 顶层配置 API 选项，移除了冗余的 `chatApiConfigs` 嵌套层级。
- **基建升级**：全面升级至 **Node.js 22 (LTS)** 和 **pnpm v10**。
- **构建优化**：引入 **Turborepo** 进行构建调度，显著提升了增量编译速度和任务管理效率。

#### 🛠 工程化增强 (Engineering)

- **自动化发布**：集成 **Changesets** 管理版本与 Changelog。
- **CI/CD 自动化**：新增 GitHub Actions 自动发布工作流。
- **开发环境标准化**：添加 `.devcontainer` 支持，确保贡献者环境高度一致。
- **规范化发布**：为所有包添加了 `peerDependencies`（Vue 3.x）和 `files` 白名单，提升了包的健壮性。

#### ⚠️ 破坏性变更 (Breaking Changes)

- `CopilotTextarea` 的 `autosuggestionsConfig` 结构已变更。请参考文档将 `chatApiConfigs.suggestionsApiConfig` 移动至顶层。

#### 📄 新增文档

- 新增 `SECURITY.md` 安全政策。
- 重构了 `CONTRIBUTING.md` 贡献指南，简化了参与流程。
