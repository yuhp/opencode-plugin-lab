import type { PluginLabOptions } from "../plugin"
import type { Logger } from "../logger"

export function createEventHook(
  options: PluginLabOptions,
  logger: Logger
) {
  return async ({ event }: { event: { type?: string } }) => {
    logger.info("Event hook called", {
      type: event?.type ?? "unknown",
      debug: options.debug === true,
    })
  }
}
