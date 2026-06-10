import { LoggerConstants } from '@/core/constants'
import { LoggerConfig } from '@/core/config'

const _filterPropertyName = (name: string) => {
	const isNotConstructor = name !== 'constructor'
	const isPublic = !name.startsWith('_')
	const shouldLog = LoggerConfig.logPrivateMethods || isPublic
	return isNotConstructor && shouldLog
}

export const getMethodDescriptors = (target: Function) => {
	const allPropertyNames = Object.getOwnPropertyNames(target.prototype)
	const propertyNames = allPropertyNames.filter(_filterPropertyName)
	return propertyNames
		.map((methodName) => {
			const descriptor = Object.getOwnPropertyDescriptor(target.prototype, methodName)
			if (!descriptor || typeof descriptor.value !== 'function') return null
			return { methodName, descriptor }
		})
		.filter((item) => item !== null)
}

export const markAsDecorated = (target: Function) => {
	Object.defineProperty(target, LoggerConstants.DECORATED_KEY, {
		value: true,
		enumerable: false,
		writable: false,
		configurable: false,
	})
}

export const checkIfWasDecorated = (target: Function): boolean => {
	return Reflect.has(target, LoggerConstants.DECORATED_KEY)
}
