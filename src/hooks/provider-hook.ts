import type { ProviderHook } from "@opencode-ai/plugin"
import type { Model as ProviderModel } from "@opencode-ai/sdk/v2"
import type { Logger } from "../logger"
import type { PluginLabOptions } from "../plugin"

export function createProviderHook(options: PluginLabOptions, logger: Logger): ProviderHook {
  return {
    id: "lab-provider",
    models: async (provider, ctx) => {
      logger.info("Provider hook called", {
        providerID: provider.id,
        providerName: provider.name,
        hasAuth: Boolean(ctx.auth),
      })

      if (provider.id !== "lab-provider") {
        return {} as Record<string, ProviderModel>
      }

      const models: Record<string, ProviderModel> = {
        "lab-echo": {
          id: "lab-echo",
          providerID: provider.id,
          api: {
            id: provider.id,
            url: String(provider.options?.baseURL ?? "http://127.0.0.1:9999/v1"),
            npm: String(provider.options?.npm ?? "@opencode-ai/plugin-lab"),
          },
          name: `Lab Echo (${options.tag ?? "default"})`,
          capabilities: {
            temperature: true,
            reasoning: false,
            attachment: false,
            toolcall: true,
            input: {
              text: true,
              audio: false,
              image: false,
              video: false,
              pdf: false,
            },
            output: {
              text: true,
              audio: false,
              image: false,
              video: false,
              pdf: false,
            },
            interleaved: false,
          },
          cost: {
            input: 0,
            output: 0,
            cache: {
              read: 0,
              write: 0,
            },
          },
          limit: {
            context: 32000,
            output: 4096,
          },
          status: "active",
          options: {
            tag: options.tag ?? "default",
          },
          headers: {},
          release_date: "2026-01-01",
        },
      }

      return models
    },
  }
}
