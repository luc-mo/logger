import { LoggerConfig } from '@/core/config'
import { LoggerUtils } from '@/utils'
import type { ILogSeverity, IMethodParams } from '@/types/logger'

/**
 * Intercepta la ejecución de un método para generar logs de forma automática.
 * Registra el inicio (`STARTED`), finalización exitosa (`COMPLETED`) o error (`FAILED`).
 * Incluye en el log el tiempo de duración, el identificador de ejecución (`traceId`)
 * y los parámetros configurados.
 *
 * @param severity Nivel de severidad para los logs de inicio y éxito (los errores utilizan 'ERROR').
 * @param className Nombre de la clase contenedora.
 * @param methodName Nombre del método interceptado.
 * @param originalMethod Función original a ejecutar.
 * @param params (Opcional) Parámetros del método que se extraerán para incluirlos en el log.
 * @returns La función decorada con la lógica de logging.
 */
export const updateMethodDescriptor = (
	severity: ILogSeverity,
	className: string,
	methodName: string,
	originalMethod: Function,
	params?: IMethodParams
) => {
	const logCaller = LoggerUtils.logLevelCaller(severity)
	const errorLogCaller = LoggerUtils.logLevelCaller('ERROR')

	return function <T>(this: T, ...args: any[]) {
		const extractedTraceId = LoggerUtils.extractTraceId()
		const extractedParams = LoggerUtils.extractMethodParams(args, params)

		if (LoggerConfig.logEvents.start) {
			logCaller(
				`[${className}] method=${methodName} ${extractedTraceId} event=STARTED ${extractedParams}`
			)
		}

		const extractDuration = LoggerUtils.durationCalculator()

		try {
			const returnValue = originalMethod.apply(this, args)
			if (returnValue instanceof Promise) {
				return returnValue
					.then((result) => {
						if (LoggerConfig.logEvents.complete) {
							logCaller(
								`[${className}] method=${methodName} ${extractedTraceId} event=COMPLETED ${extractDuration()}`
							)
						}
						return result
					})
					.catch((error) => {
						if (LoggerConfig.logEvents.error) {
							errorLogCaller(
								`[${className}] method=${methodName} ${extractedTraceId} event=FAILED ${extractDuration()} error=${error?.message ?? 'Unknown error'}`
							)
						}
						throw error
					})
			}
			if (LoggerConfig.logEvents.complete) {
				logCaller(
					`[${className}] method=${methodName} ${extractedTraceId} event=COMPLETED ${extractDuration()}`
				)
			}
			return returnValue
		} catch (error: any) {
			if (LoggerConfig.logEvents.error) {
				errorLogCaller(
					`[${className}] method=${methodName} ${extractedTraceId} event=FAILED ${extractDuration()} error=${error?.message ?? 'Unknown error'}`
				)
			}
			throw error
		}
	}
}
