/**
 * Representa una interfaz de decorador unificada que se puede aplicar tanto a clases como a métodos.
 *
 * - Como decorador de clase: Intercepta y potencialmente modifica el constructor de la clase.
 * - Como decorador de método: Intercepta la ejecución de un método de clase específico.
 */
export interface IDualDecorator {
	/** Decorador de clase */
	<T extends Function>(target: T): T

	/** Decorador de método */
	<T, Args extends unknown[], Return>(
		target: T,
		propertyKey: string | symbol,
		descriptor: TypedPropertyDescriptor<(...args: Args) => Return>
	): TypedPropertyDescriptor<(...args: Args) => Return> | undefined
}
