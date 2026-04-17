import type { Plugin, PluginOptions } from "@opencode-ai/plugin"
import { createLogger } from "./logger"
import { createConfigHook } from "./hooks/config-hook"
import { createEventHook } from "./hooks/event-hook"
import { createChatParamsHook } from "./hooks/chat-params-hook"
import { createShellEnvHook } from "./hooks/shell-env-hook"
import { createToolBeforeHook } from "./hooks/tool-before-hook"
import { createLabTool } from "./hooks/tool-hook"
import { createProviderHook } from "./hooks/provider-hook"

export interface PluginLabOptions extends PluginOptions {
  debug?: boolean
  tag?: string
  enableConfigMutation?: boolean
  injectShellEnv?: boolean
  enableLabTool?: boolean
  enableProviderHook?: boolean
  writeLocalLog?: boolean
  clearLocalLog?: boolean
}

export const PluginLab: Plugin = async (input, options) => {
  const pluginOptions = (options ?? {}) as PluginLabOptions
  const logger = createLogger(input.client, {
    category: "plugin",
    tag: pluginOptions.tag ?? "default",
  }, {
    writeLocalLog: pluginOptions.writeLocalLog,
    clearLocalLog: pluginOptions.clearLocalLog,
  })

  logger.info("Plugin lab initialized", {
    directory: input.directory,
    worktree: input.worktree,
    debug: pluginOptions.debug === true,
  })

  return {
    config: createConfigHook(pluginOptions, logger.child({ category: "config" })),
    event: createEventHook(pluginOptions, logger.child({ category: "event" })),
    "chat.params": createChatParamsHook(pluginOptions, logger.child({ category: "chat.params" })),
    "shell.env": createShellEnvHook(pluginOptions, logger.child({ category: "shell.env" })),
    "tool.execute.before": createToolBeforeHook(pluginOptions, logger.child({ category: "tool.execute.before" })),
    tool: pluginOptions.enableLabTool === false ? undefined : {
      lab_echo: createLabTool(pluginOptions, logger.child({ category: "tool" })),
    },
    provider: pluginOptions.enableProviderHook === false
      ? undefined
      : createProviderHook(pluginOptions, logger.child({ category: "provider" })),
  }
}
