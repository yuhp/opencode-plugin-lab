import type { PluginLabOptions } from "../plugin"
import type { Logger } from "../logger"

export function createShellEnvHook(
  options: PluginLabOptions,
  logger: Logger
) {
  return async (
    input: { cwd: string; sessionID?: string; callID?: string },
    output: { env: Record<string, string> }
  ) => {
    logger.info("shell.env hook called", {
      cwd: input.cwd,
      sessionID: input.sessionID,
      callID: input.callID,
    })

    if (!options.injectShellEnv) {
      return
    }

    output.env.OPENCODE_PLUGIN_LAB = "1"
    output.env.OPENCODE_PLUGIN_LAB_TAG = String(options.tag ?? "default")
  }
}
