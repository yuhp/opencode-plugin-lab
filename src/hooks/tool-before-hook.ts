import type { PluginLabOptions } from "../plugin"
import type { Logger } from "../logger"

export function createToolBeforeHook(
  options: PluginLabOptions,
  logger: Logger
) {
  return async (
    input: { tool: string; sessionID: string; callID: string },
    output: { args: Record<string, unknown> }
  ) => {
    logger.info("tool.execute.before hook called", {
      tool: input.tool,
      sessionID: input.sessionID,
      callID: input.callID,
    })

    if (input.tool === "bash" && options.debug) {
      logger.debug("Observed bash tool execution before dispatch", {
        tag: options.tag ?? "default",
      })
    }
  }
}
