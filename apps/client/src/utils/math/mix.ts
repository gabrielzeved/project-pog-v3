/**
 * Calculates the mix of two numbers based on a parameter.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @param {number} p - The parameter used to mix the two numbers.
 * @return {number} The resulting mix of the two numbers.
 */
Math.mix = function (a: number, b: number, p: number) {
	return a * (1 - p) + b * p;
};
