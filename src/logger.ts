import type { PluginInput } from "@opencode-ai/plugin"
import * as fs from "fs"

type PluginClient = PluginInput["client"] | null | undefined
type Level = "debug" | "info" | "warn" | "error"

export interface Logger {
  debug(message: string, extra?: Record<string, unknown>): void
  info(message: string, extra?: Record<string, unknown>): void
  warn(message: string, extra?: Record<string, unknown>): void
  error(message: string, extra?: Record<string, unknown>): void
  child(extra: Record<string, unknown>): Logger
}

export interface LoggerOptions {
  writeLocalLog?: boolean
  clearLocalLog?: boolean
}

export function createLogger(client?: PluginClient, base: Record<string, unknown> = {}, options?: LoggerOptions): Logger {
  if (options?.clearLocalLog) {
    try {
      fs.writeFileSync("plugin-lab.log", "")
    } catch (e) {
      // ignore fs errors
    }
  }

  const childOptions: LoggerOptions = { writeLocalLog: options?.writeLocalLog }

  const log = (level: Level, message: string, extra?: Record<string, unknown>) => {
    const payload = {
      ...base,
      ...extra,
    }

    if (options?.writeLocalLog) {
      try {
        const logLine = `[${new Date().toISOString()}] [${level}] [opencode-plugin-lab] ${message} ${Object.keys(payload).length ? JSON.stringify(payload) : ""}\n`
        fs.appendFileSync("plugin-lab.log", logLine)
      } catch (e) {
        // ignore fs errors
      }
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
      return createLogger(client, { ...base, ...extra }, childOptions)
    },
  }
}
