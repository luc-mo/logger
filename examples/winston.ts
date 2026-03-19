import { Logger } from '@/index'
import { createLogger, format, transports, type LeveledLogMethod } from 'winston'
const { combine, timestamp, printf } = format

/**
 * Extendemos la interfaz de Winston para que soporte los niveles exactos
 * que utiliza nuestro decorador por defecto (fatal y trace no vienen por defecto).
 */
declare module 'winston' {
	export interface Logger {
		fatal: LeveledLogMethod
		error: LeveledLogMethod
		warn: LeveledLogMethod
		info: LeveledLogMethod
		debug: LeveledLogMethod
		trace: LeveledLogMethod
	}
}

/**
 * Configuramos el logger de Winston con formato y niveles personalizados.
 */
const winstonLogger = createLogger({
	/**
	 * Definimos el nivel de loggeo como trace para que la
	 * responsabilidad de loggear la tenga el decorador y no el logger.
	 */
	level: 'trace',
	levels: { fatal: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5 },
	transports: [new transports.Console()],
	format: combine(
		timestamp(),
		printf(({ timestamp, level, message }) => {
			return `[${timestamp}] [${level.toUpperCase()}] ${message}`
		})
	),
})

/**
 * Configuramos el logger globalmente con un nivel DEBUG (el nivel por defecto es INFO).
 */
Logger.config({ level: 'DEBUG', logger: winstonLogger })

/**
 * Decoramos todos los métodos de la clase con nivel DEBUG.
 */
@Logger({ severity: 'DEBUG' })
class ClasePrueba {
	public metodoLoggeado() {
		/** Este método se loggea con nivel DEBUG. */
	}

	@Logger({ severity: 'TRACE' })
	public metodoNoLoggeado() {
		/**
		 * Este método debería loggearse con nivel TRACE.
		 * Pero como el nivel mínimo configurado es DEBUG, no se loggea al ser ejecutado.
		 */
	}
}

const test = new ClasePrueba()
test.metodoLoggeado()
test.metodoNoLoggeado()
