export class LogBuilder {
	private _message: string

	constructor(initialMessage = '') {
		this._message = initialMessage
	}

	/**
	 * Devuelve el mensaje final construido. Aplica un `String.trim()` antes de devolver el resultado.
	 */
	public build(): string {
		return this._message.trim()
	}

	/**
	 * Agrega un fragmento de texto al mensaje actual, separándolo
	 * con un espacio del contenido previo.
	 *
	 * @param message Texto a concatenar al mensaje.
	 * @example
	 * const logMessage = new LogBuilder('Hola')
	 *   .append('Mundo')
	 * 	 .build()
	 * // logMessage contendrá: "Hola Mundo"
	 */
	public append(message: string): LogBuilder {
		this._message = this._message.concat(' ').concat(message)
		return this
	}

	/**
	 * Agrega un parámetro con formato `nombre="valor"` al mensaje,
	 * escapando comillas dobles presentes en el valor.
	 * Si el valor es un string vacío, `null` o `undefined`, no se agrega al mensaje.
	 *
	 * @param paramName Nombre del parámetro.
	 * @param paramValue Valor del parámetro.
	 * @note Añade un espacio antes del parámetro, heredado del metodo {@link LogBuilder.append}.
	 * @example
	 * const logMessage = new LogBuilder('Logger')
	 *   .appendParam('userId', '12345')
	 * 	 .appendParam('status', 'active')
	 * 	 .build()
	 * // logMessage contendrá: "Logger userId=\"12345\" status=\"active\""
	 */
	public appendParam(paramName: string, paramValue: string | null | undefined): LogBuilder {
		if (!paramValue) return this
		return this.append(`${paramName}="${this._escapeQuotes(paramValue)}"`)
	}

	/**
	 * Escapa las comillas dobles presentes en un valor para evitar
	 * romper el formato del mensaje.
	 *
	 * @param value Valor a escapar.
	 */
	private _escapeQuotes(value: string): string {
		return value.replace(/"/g, '\\"')
	}
}
