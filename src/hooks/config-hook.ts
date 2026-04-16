import type { PluginLabOptions } from "../plugin"
import type { Logger } from "../logger"

export function createConfigHook(
  options: PluginLabOptions,
  logger: Logger
) {
  return async (config: Record<string, unknown>) => {
    logger.info("Config hook called", {
      hasPluginArray: Array.isArray(config.plugin),
      hasProviderConfig: typeof config.provider === "object" && config.provider !== null,
    })

    if (!options.enableConfigMutation) {
      return
    }

    const commands = (config.command as Record<string, unknown> | undefined) ?? {}
    config.command = {
      ...commands,
      "lab:ping": {
        template: "Explain what hooks from opencode-plugin-lab are active in the current session.",
        description: "Inspect opencode-plugin-lab hooks",
      },
    }

    logger.info("Injected lab command into runtime config", {
      tag: options.tag ?? "default",
    })
  }
}
