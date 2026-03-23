import { AsyncLocalStorage } from 'node:async_hooks'
import type { ILogSeverity, ILoggerInstance, ILogEvents } from '@/types/logger'

export class LoggerConfig {
	public static readonly context = new AsyncLocalStorage<string>()
	public static level: ILogSeverity = 'INFO'
	public static logger: ILoggerInstance = {
		fatal: console.error,
		error: console.error,
		warn: console.warn,
		info: console.info,
		debug: console.debug,
		trace: console.trace,
	}
	public static logEvents: ILogEvents = {
		start: true,
		complete: true,
		error: true,
	}
}
