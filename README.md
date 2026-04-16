# opencode-plugin-lab

Chinese version: [README.zh.md](./README.zh.md)

A lab project for exploring OpenCode plugin loading, hook behavior, and extension boundaries.

## Goals

- Verify how OpenCode loads plugins
- Explore the behavior of hooks such as `config`, `event`, `chat.params`, `tool.execute.before`, `shell.env`, `tool`, and `provider`
- Maintain a small, isolated plugin skeleton that can be extended for further experiments

## Project Structure

```text
src/
  index.ts                 # Plugin export entry
  plugin.ts                # Main plugin implementation
  logger.ts                # Minimal structured logging wrapper
  hooks/
    config-hook.ts         # Config mutation example
    event-hook.ts          # Event listener example
    chat-params-hook.ts    # Chat parameter mutation example
    provider-hook.ts       # Provider hook example
    shell-env-hook.ts      # Shell environment injection example
    tool-before-hook.ts    # Tool interception example
    tool-hook.ts           # Custom tool example
docs/
  experiments.md           # Experiment checklist
opencode.json             # Local debugging config example
```

## Install Locally

```bash
npm install
```

## Typecheck

```bash
npm run typecheck
```

## Use As An OpenCode Plugin

Reference the local directory in `opencode.json`:

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

It is best to start by observing hook order through logs, then enable or extend each experiment one by one.

## Built-in Experiments

### `config`

- Injects a `command.lab:ping` entry into the runtime config
- Helps verify whether the config object can be mutated in place

### `event`

- Logs event types
- Useful for observing session, tool, and TUI lifecycle events

### `chat.params`

- Logs the current session, agent, and model
- Injects `labTag` into `output.options` when debug mode is enabled

### `shell.env`

- Injects `OPENCODE_PLUGIN_LAB=1`
- Injects `OPENCODE_PLUGIN_LAB_TAG`

### `tool.execute.before`

- Observes the timing of tool execution before dispatch
- Does not mutate built-in tool arguments by default to avoid breaking host behavior

### `tool`

- Registers a custom tool named `lab_echo`
- Useful for verifying plugin tool registration and invocation

### `provider`

- Registers a provider hook with `id = "lab-provider"`
- Dynamically returns a `lab-echo` model when the provider id matches
- Helps verify that dynamic provider-backed model supply is a separate path from config mutation
