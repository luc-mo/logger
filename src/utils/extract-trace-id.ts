import { LoggerConfig } from '@/core/config'

export const extractTraceId = () => {
	const traceId = LoggerConfig.context.getStore()
	if (!traceId) return ''
	return `traceId=${traceId}`
}
