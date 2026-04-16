import type { PluginInput } from "@opencode-ai/plugin"

type PluginClient = PluginInput["client"] | null | undefined
type Level = "debug" | "info" | "warn" | "error"

export interface Logger {
  debug(message: string, extra?: Record<string, unknown>): void
  info(message: string, extra?: Record<string, unknown>): void
  warn(message: string, extra?: Record<string, unknown>): void
  error(message: string, extra?: Record<string, unknown>): void
  child(extra: Record<string, unknown>): Logger
}

export function createLogger(client?: PluginClient, base: Record<string, unknown> = {}): Logger {
  const log = (level: Level, message: string, extra?: Record<string, unknown>) => {
    const payload = {
      ...base,
      ...extra,
    }

    if (client?.app?.log) {
      void client.app.log({
        body: {
          service: "opencode-plugin-lab",
          level,
          message,
          extra: payload,
        },
      }).catch(() => {
        console[level === "debug" ? "info" : level](`[opencode-plugin-lab] ${message}`, payload)
      })
      return
    }

    console[level === "debug" ? "info" : level](`[opencode-plugin-lab] ${message}`, payload)
  }

  return {
    debug(message: string, extra?: Record<string, unknown>) {
      log("debug", message, extra)
    },
    info(message: string, extra?: Record<string, unknown>) {
      log("info", message, extra)
    },
    warn(message: string, extra?: Record<string, unknown>) {
      log("warn", message, extra)
    },
    error(message: string, extra?: Record<string, unknown>) {
      log("error", message, extra)
    },
    child(extra: Record<string, unknown>) {
      return createLogger(client, { ...base, ...extra })
    },
  }
}
