import { LoggerConfig } from '@/core/config'
import { LoggerConstants } from '@/core/constants'
import type { ILogSeverity } from '@/types/logger'

export const logLevelCaller =
	(level: ILogSeverity) =>
	(message: string, ...meta: any[]) => {
		const currentLevelIndex = LoggerConstants.SEVERITY_LEVELS.indexOf(LoggerConfig.level)
		const messageLevelIndex = LoggerConstants.SEVERITY_LEVELS.indexOf(level)
		if (messageLevelIndex <= currentLevelIndex) {
			const cleanedMessage = message.replace(LoggerConstants.MESSAGE_REGEXP, ' ')
			LoggerConfig.logger[level.toLowerCase() as Lowercase<ILogSeverity>](cleanedMessage, ...meta)
		}
	}
