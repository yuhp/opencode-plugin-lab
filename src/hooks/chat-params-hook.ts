import type { PluginLabOptions } from "../plugin"
import type { Logger } from "../logger"

export function createChatParamsHook(
  options: PluginLabOptions,
  logger: Logger
) {
  return async (
    input: { sessionID: string; agent: string; model: { id?: string } },
    output: { temperature: number; topP: number; topK: number; maxOutputTokens: number | undefined; options: Record<string, unknown> }
  ) => {
    logger.info("chat.params hook called", {
      sessionID: input.sessionID,
      agent: input.agent,
      modelID: input.model?.id ?? "unknown",
    })

    if (!options.debug) {
      return
    }

    output.options.labTag = options.tag ?? "default"
  }
}
