import { tool } from "@opencode-ai/plugin"
import type { Logger } from "../logger"
import type { PluginLabOptions } from "../plugin"

export function createLabTool(options: PluginLabOptions, logger: Logger) {
  return tool({
    description: "Echoes lab metadata to verify plugin tool registration",
    args: {
      message: tool.schema.string().describe("Message to echo back"),
    },
    async execute(args, context) {
      logger.info("Custom lab tool executed", {
        sessionID: context.sessionID,
        messageID: context.messageID,
        directory: context.directory,
      })

      context.metadata({
        title: "opencode-plugin-lab tool run",
        metadata: {
          tag: options.tag ?? "default",
          directory: context.directory,
          worktree: context.worktree,
        },
      })

      return [
        `lab message: ${args.message}`,
        `tag: ${options.tag ?? "default"}`,
        `directory: ${context.directory}`,
        `worktree: ${context.worktree}`,
      ].join("\n")
    },
  })
}
