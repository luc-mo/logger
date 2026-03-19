import express from 'express'
import crypto from 'node:crypto'
import { Logger } from '@/index'

/**
 * Configuramos el logger globalmente con un nivel DEBUG (el nivel por defecto es INFO).
 */
Logger.config({ level: 'DEBUG' })

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

const app = express()

app.use((req, res, next) => {
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
})

app.get(/.*/, (_, res) => {
	const clasePrueba = new ClasePrueba()
	clasePrueba.metodoLoggeado()
	clasePrueba.metodoNoLoggeado()
	res.send({ message: 'Hello, World!' })
})

app.listen(3000, () => {
	console.log('Server up and running on http://localhost:3000')
})
