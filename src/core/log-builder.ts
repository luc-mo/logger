export class LogBuilder {
	private _message: string

	constructor(initialMessage = '') {
		this._message = initialMessage
	}

	public build(): string {
		return this._message.trim()
	}

	public append(message: string): LogBuilder {
		this._message = this._message.concat(' ').concat(message)
		return this
	}

	public appendParam(paramName: string, paramValue: string | null | undefined): LogBuilder {
		if (!paramValue) return this
		return this.append(`${paramName}="${this._escapeQuotes(paramValue)}"`)
	}

	private _escapeQuotes(value: string): string {
		return value.replace(/"/g, '\\"')
	}
}
