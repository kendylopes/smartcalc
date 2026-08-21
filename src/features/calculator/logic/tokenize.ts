/**
 * Divide uma expressão matemática em tokens seguros para avaliação.
 * Suporta números inteiros, decimais, operadores binários e unários negativos.
 */
export const tokenize = (value: string): string[] => {
	const tokens: string[] = [];
	let currentNumber = "";
	const operators = ["+", "-", "*", "/"];

	for (let i = 0; i < value.length; i++) {
		const char = value[i];
		const isOperator = operators.includes(char);

		if (isOperator) {
			// Identifica se '-' é um operador unário de sinal negativo
			const isUnaryMinus =
				char === "-" &&
				((tokens.length === 0 && currentNumber === "") ||
					(currentNumber === "" &&
						tokens.length > 0 &&
						operators.includes(tokens[tokens.length - 1])));

			if (isUnaryMinus) {
				currentNumber += char;
				continue;
			}

			if (currentNumber) {
				tokens.push(currentNumber);
				currentNumber = "";
			}

			tokens.push(char);
		} else {
			currentNumber += char;
		}
	}

	if (currentNumber) {
		tokens.push(currentNumber);
	}

	return tokens;
};
