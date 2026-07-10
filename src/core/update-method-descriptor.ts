import { LoggerConfig } from '@/core/config'
import { LogBuilder } from './log-builder'
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
			const log = new LogBuilder(`[${className}]`)
				.appendParam('method', methodName)
				.appendParam('traceId', extractedTraceId.message)
				.appendParam('event', 'STARTED')
				.append(extractedParams.message)
				.build()
			logCaller(log, {
				className,
				methodName,
				traceId: extractedTraceId.traceId,
				params: extractedParams.params,
				event: 'STARTED',
			})
		}

		const extractDuration = LoggerUtils.durationCalculator()

		try {
			const returnValue = originalMethod.apply(this, args)
			if (returnValue instanceof Promise) {
				return returnValue
					.then((result) => {
						if (LoggerConfig.logEvents.complete) {
							const extractedDuration = extractDuration()
							const log = new LogBuilder(`[${className}]`)
								.appendParam('method', methodName)
								.appendParam('traceId', extractedTraceId.message)
								.appendParam('event', 'COMPLETED')
								.appendParam('duration', extractedDuration.message)
								.build()
							logCaller(log, {
								className,
								methodName,
								traceId: extractedTraceId.traceId,
								params: extractedParams.params,
								duration: extractedDuration.duration,
								event: 'COMPLETED',
							})
						}
						return result
					})
					.catch((error) => {
						if (LoggerConfig.logEvents.error) {
							const extractedDuration = extractDuration()
							const log = new LogBuilder(`[${className}]`)
								.appendParam('method', methodName)
								.appendParam('traceId', extractedTraceId.message)
								.appendParam('event', 'FAILED')
								.appendParam('duration', extractedDuration.message)
								.appendParam('error', error?.message ?? 'Unknown error')
								.build()
							errorLogCaller(log, {
								className,
								methodName,
								traceId: extractedTraceId.traceId,
								params: extractedParams.params,
								duration: extractedDuration.duration,
								error: error?.message ?? 'Unknown error',
								event: 'FAILED',
							})
						}
						throw error
					})
			}
			if (LoggerConfig.logEvents.complete) {
				const extractedDuration = extractDuration()
				const log = new LogBuilder(`[${className}]`)
					.appendParam('method', methodName)
					.appendParam('traceId', extractedTraceId.message)
					.appendParam('event', 'COMPLETED')
					.appendParam('duration', extractedDuration.message)
					.build()
				logCaller(log, {
					className,
					methodName,
					traceId: extractedTraceId.traceId,
					params: extractedParams.params,
					duration: extractedDuration.duration,
					event: 'COMPLETED',
				})
			}
			return returnValue
		} catch (error: any) {
			if (LoggerConfig.logEvents.error) {
				const extractedDuration = extractDuration()
				const log = new LogBuilder(`[${className}]`)
					.appendParam('method', methodName)
					.appendParam('traceId', extractedTraceId.message)
					.appendParam('event', 'FAILED')
					.appendParam('duration', extractedDuration.message)
					.appendParam('error', error?.message ?? 'Unknown error')
					.build()
				errorLogCaller(log, {
					className,
					methodName,
					traceId: extractedTraceId.traceId,
					params: extractedParams.params,
					duration: extractedDuration.duration,
					error: error?.message ?? 'Unknown error',
					event: 'FAILED',
				})
			}
			throw error
		}
	}
}
