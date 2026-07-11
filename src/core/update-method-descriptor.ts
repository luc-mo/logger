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
		const traceId = LoggerConfig.context.getStore()
		const extractedParams = LoggerUtils.extractMethodParams(args, params)

		const hasParams = Object.keys(extractedParams.params).length > 0
		const paramsWrapper = hasParams ? { params: extractedParams.params } : {}

		if (LoggerConfig.logEvents.start) {
			const log = new LogBuilder(`[${className}]`)
				.appendParam('method', methodName)
				.appendParam('traceId', traceId)
				.appendParam('event', 'STARTED')
				.append(extractedParams.message)
				.build()
			logCaller(log, {
				className,
				methodName,
				traceId,
				event: 'STARTED',
				...paramsWrapper,
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
								.appendParam('traceId', traceId)
								.appendParam('event', 'COMPLETED')
								.appendParam('duration', extractedDuration.message)
								.build()
							logCaller(log, {
								className,
								methodName,
								traceId,
								duration: extractedDuration.duration,
								event: 'COMPLETED',
								...paramsWrapper,
							})
						}
						return result
					})
					.catch((error) => {
						if (LoggerConfig.logEvents.error) {
							const extractedDuration = extractDuration()
							const extractedError = error?.message ?? 'Unknown error'
							const log = new LogBuilder(`[${className}]`)
								.appendParam('method', methodName)
								.appendParam('traceId', traceId)
								.appendParam('event', 'FAILED')
								.appendParam('duration', extractedDuration.message)
								.appendParam('error', extractedError)
								.build()
							errorLogCaller(log, {
								className,
								methodName,
								traceId,
								duration: extractedDuration.duration,
								error: extractedError,
								event: 'FAILED',
								...paramsWrapper,
							})
						}
						throw error
					})
			}
			if (LoggerConfig.logEvents.complete) {
				const extractedDuration = extractDuration()
				const log = new LogBuilder(`[${className}]`)
					.appendParam('method', methodName)
					.appendParam('traceId', traceId)
					.appendParam('event', 'COMPLETED')
					.appendParam('duration', extractedDuration.message)
					.build()
				logCaller(log, {
					className,
					methodName,
					traceId,
					duration: extractedDuration.duration,
					event: 'COMPLETED',
					...paramsWrapper,
				})
			}
			return returnValue
		} catch (error: any) {
			if (LoggerConfig.logEvents.error) {
				const extractedDuration = extractDuration()
				const extractedError = error?.message ?? 'Unknown error'
				const log = new LogBuilder(`[${className}]`)
					.appendParam('method', methodName)
					.appendParam('traceId', traceId)
					.appendParam('event', 'FAILED')
					.appendParam('duration', extractedDuration.message)
					.appendParam('error', extractedError)
					.build()
				errorLogCaller(log, {
					className,
					methodName,
					traceId,
					duration: extractedDuration.duration,
					error: extractedError,
					event: 'FAILED',
					...paramsWrapper,
				})
			}
			throw error
		}
	}
}
