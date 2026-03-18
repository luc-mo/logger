import type { ILogSeverity } from '@/types/logger'

export class LoggerConstants {
	public static readonly DECORATED_KEY = Symbol('LOGGER_DECORATED_KEY')
	public static readonly MESSAGE_REGEXP = /\s{2,}/g
	public static readonly SEVERITY_LEVELS: ILogSeverity[] = [
		'FATAL',
		'ERROR',
		'WARN',
		'INFO',
		'DEBUG',
		'TRACE',
	] as const
}
