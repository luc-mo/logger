import { LoggerConfig } from '@/core/config'
import { LoggerUtils } from '@/utils'
import { updateMethodDescriptor } from '@/core/update-method-descriptor'
import type { ILoggerDecorator, ILoggerParams } from '@/types/logger'

/**
 * Decora clases o métodos para generar logs de forma automática.
 * Si se aplica a una clase, agrega logging a todos sus métodos.
 * Si se aplica a un método, lo hace individualmente.
 *
 * Si un método ya tiene su propio decorador, este sobreescribirá
 * la configuración del decorador de la clase constructora.
 *
 * @param options Configuración con el nivel de severidad y los parámetros a extraer.
 * @returns Función que aplica la lógica de logging.
 */
const LoggerDecorator: ILoggerDecorator = ({ severity, params }: ILoggerParams) => {
	return <T extends Function, Args extends unknown[], Return>(
		target: T,
		propertyKey?: string | symbol,
		descriptor?: TypedPropertyDescriptor<(...args: Args) => Return>
	) => {
		if (propertyKey && descriptor) {
			if (
				typeof descriptor.value !== 'function' ||
				LoggerUtils.checkIfWasDecorated(descriptor.value)
			) {
				return descriptor
			}

			const className = target.constructor.name
			const methodName = propertyKey.toString()
			const originalMethod = descriptor.value

			const updatedMethod = updateMethodDescriptor(
				severity,
				className,
				methodName,
				originalMethod,
				params
			)
			LoggerUtils.markAsDecorated(updatedMethod)

			descriptor.value = updatedMethod
			return descriptor
		}

		if (LoggerUtils.checkIfWasDecorated(target.prototype)) {
			return target
		}

		const className = target.name
		const descriptors = LoggerUtils.getMethodDescriptors(target)

		for (const { methodName, descriptor } of descriptors) {
			const originalMethod = descriptor.value
			if (LoggerUtils.checkIfWasDecorated(originalMethod)) continue
			descriptor.value = updateMethodDescriptor(severity, className, methodName, originalMethod)
			Object.defineProperty(target.prototype, methodName, descriptor)
		}

		LoggerUtils.markAsDecorated(target.prototype)
		return target
	}
}

LoggerDecorator.context = LoggerConfig.context

LoggerDecorator.config = ({ level, logger, logEvents }) => {
	if (level) LoggerConfig.level = level
	if (logger) LoggerConfig.logger = logger
	if (logEvents) {
		LoggerConfig.logEvents = {
			start: logEvents.start ?? LoggerConfig.logEvents.start,
			complete: logEvents.complete ?? LoggerConfig.logEvents.complete,
			error: logEvents.error ?? LoggerConfig.logEvents.error,
		}
	}
}

LoggerDecorator.fatal = LoggerUtils.logLevelCaller('FATAL')
LoggerDecorator.error = LoggerUtils.logLevelCaller('ERROR')
LoggerDecorator.warn = LoggerUtils.logLevelCaller('WARN')
LoggerDecorator.info = LoggerUtils.logLevelCaller('INFO')
LoggerDecorator.debug = LoggerUtils.logLevelCaller('DEBUG')
LoggerDecorator.trace = LoggerUtils.logLevelCaller('TRACE')

export { LoggerDecorator as Logger }
