import { getMethodDescriptors, markAsDecorated, checkIfWasDecorated } from './descriptor-utils'
import { durationCalculator } from './duration-calculator'
import { extractMethodParams } from './extract-method-params'
import { logLevelCaller } from './log-level-caller'

export class LoggerUtils {
	public static readonly getMethodDescriptors = getMethodDescriptors
	public static readonly markAsDecorated = markAsDecorated
	public static readonly checkIfWasDecorated = checkIfWasDecorated
	public static readonly durationCalculator = durationCalculator
	public static readonly extractMethodParams = extractMethodParams
	public static readonly logLevelCaller = logLevelCaller
}
