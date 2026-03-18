import type { IMethodParams } from '@/types/logger'

export const extractMethodParams = (args: any[], params?: IMethodParams) => {
	if (!params || !params.length) return ''
	const extractedParams: Record<string, any> = {}

	for (const param of params) {
		if (typeof param === 'string') {
			const argParam = args[0]
			extractedParams[param] = argParam[param]
		} else {
			const { index, name } = param
			extractedParams[name] = args[index]
		}
	}
	return `params=${JSON.stringify(extractedParams)}`
}
