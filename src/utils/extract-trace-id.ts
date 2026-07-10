import { LoggerConfig } from '@/core/config'

export const extractTraceId = () => {
	const traceId = LoggerConfig.context.getStore()
	if (!traceId) return { traceId: null, message: '' }
	return { traceId, message: `traceId=${traceId}` }
}
