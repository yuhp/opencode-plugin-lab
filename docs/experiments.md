# Experiments

## 建议实验顺序

1. 只启用 `event`，确认插件是否被正确加载。
2. 启用 `config`，验证配置对象是否可原位修改。
3. 启用 `shell.env`，验证 shell 子进程是否能收到实验变量。
4. 启用 `tool.execute.before`，验证是否能拦截或改写工具参数。
5. 启用 `chat.params`，验证模型参数是否能被动态修改。
6. 调用 `lab_echo`，验证自定义 tool 是否已被注册。
7. 准备一个 `lab-provider` provider，验证 `provider` hook 是否能动态提供模型。

## 可观察点

- 插件初始化是否只执行一次
- 同一 session 中各 hook 的调用顺序
- 多插件并存时的执行叠加行为
- `config` 修改是否只影响运行时，不写回磁盘
- `shell.env` 是否同时影响 AI 工具和用户终端命令
- 自定义 `tool` 是否覆盖或补充内建工具集合
- `provider` hook 返回的模型是否与静态 `config.provider[*].models` 并存

## 后续扩展建议

- 增加 `chat.headers` 示例
- 单独实验 `experimental.*` hooks
- 增加 `auth` hook 示例
- 增加 TUI 扩展样例
