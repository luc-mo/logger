import 'reflect-metadata'
import crypto from 'node:crypto'
import { Logger } from '@/index'
import { NestFactory } from '@nestjs/core'
import {
	Module,
	Controller,
	Get,
	Logger as NestLogger,
	type NestMiddleware,
	type MiddlewareConsumer,
} from '@nestjs/common'
import type { Request, Response, NextFunction } from 'express'

const nestLogger = new NestLogger()

/**
 * Configuramos el logger globalmente con un nivel DEBUG (el nivel por defecto es INFO).
 * Además, le pasamos una instancia del logger de NestJS.
 */
Logger.config({
	level: 'DEBUG',
	logger: {
		fatal: nestLogger.fatal.bind(nestLogger),
		error: nestLogger.error.bind(nestLogger),
		warn: nestLogger.warn.bind(nestLogger),
		info: nestLogger.log.bind(nestLogger),
		debug: nestLogger.debug.bind(nestLogger),
		trace: nestLogger.verbose.bind(nestLogger),
	},
})

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

class LoggerContextMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		const traceId = (req.headers['x-trace-id'] as string) ?? crypto.randomUUID()
		/**
		 * Se inicia el contexto del logger con un traceId para que cada request
		 * sea traceable desde el punto de entrada (con el header x-trace-id o con un UUID generado)
		 * hasta el punto de salida (cuando se envía la respuesta).
		 */
		Logger.context.run(traceId, () => {
			res.setHeader('x-trace-id', traceId)
			next()
		})
	}
}

@Controller()
class AppController {
	@Get()
	public getHello() {
		const clasePrueba = new ClasePrueba()
		clasePrueba.metodoLoggeado()
		clasePrueba.metodoNoLoggeado()
		return { message: 'Hello, World!' }
	}
}

@Module({ controllers: [AppController] })
class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerContextMiddleware).forRoutes('*')
	}
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	await app.listen(3000)
	console.log('Server up and running on http://localhost:3000')
}
bootstrap()
