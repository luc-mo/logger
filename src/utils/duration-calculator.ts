export const durationCalculator = () => {
	const start = Date.now()
	return () => {
		const end = Date.now() - start
		const isPlusThanOneSecond = end > 1000

		if (isPlusThanOneSecond) {
			const seconds = (end / 1000).toFixed(2)
			return {
				message: `duration=${seconds}s`,
				duration: end,
			}
		}
		return {
			message: `duration=${end}ms`,
			duration: end,
		}
	}
}
