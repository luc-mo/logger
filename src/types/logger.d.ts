import type { AsyncLocalStorage } from 'node:async_hooks'
import type { IDualDecorator } from './dual-decorator'

export type ILoggerDecorator = ((params: ILoggerParams) => IDualDecorator) & {
	/**
	 * Contexto de ejecución basado en AsyncLocalStorage.
	 * Permite inyectar un identificador único (traceId) que se propagará
	 * automáticamente a todos los logs dentro de su ciclo de vida.
	 */
	context: AsyncLocalStorage<string>

	/**
	 * Configuración global del decorador.
	 * Permite establecer el nivel de log base y definir
	 * una instancia de logger emita los mensajes.
	 *
	 * @param params Objeto con el nivel de log (`level`) y la instancia del logger (`logger`).
	 */
	config: (params: ILoggerConfig) => void
}

export interface ILoggerParams {
	/**
	 * Nivel de severidad con el que registrará el inicio
	 * y el final exitoso del método decorado.
	 */
	severity: ILogSeverity

	/**
	 * Configuración opcional para extraer y registrar valores
	 * de los argumentos pasados al método decorado.
	 *
	 * @note Esta propiedad es ignorada cuando el decorador se aplica a una clase.
	 */
	params?: IMethodParams
}

/**
 * Define qué argumentos del método se deben extraer e incluir en el log.
 *
 * Cuando el método recibe un único objeto como parámetro, se utiliza un arreglo de
 * strings para extraer las propiedades que coincidan con esos nombres (por ejemplo, `['id', 'status']`).
 *
 * Por otro lado, cuando el método recibe múltiples argumentos por posición, se utiliza un arreglo
 * de objetos. Esto permite indicar el índice exacto del argumento que se quiere extraer y
 * asignarle un nombre descriptivo para identificarlo en el log.
 */
export type IMethodParams =
	| string[]
	| {
			/**
			 * Posición del argumento en la firma del método (0 para el primero, 1 para el segundo, etc.).
			 */
			index: number
			/**
			 * Etiqueta o nombre con el que se mostrará este valor en el registro del log.
			 */
			name: string
	  }[]

export interface ILoggerConfig {
	/**
	 * Nivel de severidad base a partir del cual se emitirán los logs.
	 * Los logs con severidad inferior a esta configuración serán ignorados.
	 */
	level?: ILogSeverity

	/**
	 * Instancia personalizada encargada de formatear y emitir los logs.
	 */
	logger?: ILoggerInstance
}

export interface ILoggerInstance {
	fatal: ILogFunction
	error: ILogFunction
	warn: ILogFunction
	info: ILogFunction
	debug: ILogFunction
	trace: ILogFunction
}

export type ILogFunction = (message: string, ...meta: any[]) => void

/**
 * Niveles de severidad soportados para la emisión de logs.
 * Ordenados de mayor a menor criticidad.
 */
export type ILogSeverity = 'FATAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE'
