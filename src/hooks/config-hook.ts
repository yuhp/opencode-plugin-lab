import type { PluginLabOptions } from "../plugin"
import type { Logger } from "../logger"

export function createConfigHook(
  options: PluginLabOptions,
  logger: Logger
) {
  return async (config: Record<string, unknown>) => {
    logger.debug("Config hook called", {
      hasPluginArray: Array.isArray(config.plugin),
      hasProviderConfig: typeof config.provider === "object" && config.provider !== null,
    })

    if (!options.enableConfigMutation) {
      return
    }

    // inject provider, for the provider hook
    const providers = (config.provider as Record<string, unknown> | undefined) ?? {}
    let existMockProvider = false
    for (const provider of Object.keys(providers)) {
      if (provider.startsWith("plugin-lab-")) {
        existMockProvider = true
        logger.debug("Found plugin-lab provider", {
          "provider id": provider,
          "provider name": (providers[provider] as any)?.name,
          "provider options": (providers[provider] as any)?.options,
        })
        continue
      }
      //log the provider not starting with plugin-lab-
      logger.debug("Found provider", {
        "provider id": provider,
        "provider name": (providers[provider] as any)?.name,
        "provider options": (providers[provider] as any)?.options,
      })
    }
    if (!existMockProvider) {
      providers["plugin-lab-mock-provider"] = {
        name: "provider hook mock provider (injected by plugin-lab)",
      }
    }
    config.provider = providers

    const commands = (config.command as Record<string, unknown> | undefined) ?? {}
    config.command = {
      ...commands,
      "lab:ping": {
        template: "Explain what hooks from opencode-plugin-lab are active in the current session.",
        description: "Inspect opencode-plugin-lab hooks",
      },
    }

    logger.debug("Injected lab command into runtime config", {
      tag: options.tag ?? "default",
    })
  }
}
