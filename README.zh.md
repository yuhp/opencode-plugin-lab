# opencode-plugin-lab

English version: [README.md](./README.md)

用于探索 OpenCode 插件加载机制、hooks 能力边界和典型实现方式的实验项目。

## 目标

- 验证 OpenCode 插件如何被加载
- 验证 `config`、`event`、`chat.params`、`tool.execute.before`、`shell.env`、`tool`、`provider` 等 hooks 的行为
- 为后续实验保留一个独立、最小、可直接扩展的插件骨架

## 目录结构

```text
src/
  index.ts                 # 插件导出入口
  plugin.ts                # 主插件实现
  logger.ts                # 简单结构化日志封装
  hooks/
    config-hook.ts         # 配置增强示例
    event-hook.ts          # 事件监听示例
    chat-params-hook.ts    # 聊天参数改写示例
    provider-hook.ts       # provider hook 示例
    shell-env-hook.ts      # shell 环境变量注入示例
    tool-before-hook.ts    # 工具执行前拦截示例
    tool-hook.ts           # 自定义 tool 示例
docs/
  experiments.md           # 实验建议清单
opencode.json             # 本地调试示例配置
```

## 本地安装

```bash
npm install
```

## 类型检查

```bash
npm run typecheck
```

## 作为 OpenCode 插件使用

在 `opencode.json` 中以本地目录形式引用：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    ["file:/Users/your-name/workspace/opencode-plugin-lab", {
      "enableConfigMutation": true,
      "injectShellEnv": true,
      "enableLabTool": true,
      "enableProviderHook": true,
      "debug": true
    }]
  ]
}
```

建议先通过日志观察 hook 调用顺序，再逐个开启或扩展实验项。

## 当前内置实验能力

### `config`

- 向运行时配置注入一个 `command.lab:ping`
- 用来验证配置对象是否允许原位修改

### `event`

- 输出事件类型日志
- 用来观察会话期、工具期、TUI 期事件

### `chat.params`

- 记录被调用的 session、agent、model
- 在 debug 模式下向 `output.options` 注入 `labTag`

### `shell.env`

- 注入 `OPENCODE_PLUGIN_LAB=1`
- 注入 `OPENCODE_PLUGIN_LAB_TAG`

### `tool.execute.before`

- 观察工具调用发生前的 hook 时机
- 默认不改写内建工具参数，避免影响宿主行为

### `tool`

- 注册一个名为 `lab_echo` 的自定义工具
- 用来验证插件工具是否能被 OpenCode 识别和调用

### `provider`

- 注册一个 `id = "lab-provider"` 的 provider hook
- 当 provider id 匹配时，动态提供一个 `lab-echo` 模型
- 用来验证“动态模型供给”与“配置注入”是两条不同能力路径
