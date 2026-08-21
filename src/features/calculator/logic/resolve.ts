/**
 * Avalia um array de tokens planos aplicando a ordem de precedência das operações:
 * Fase 1: Multiplicação e Divisão
 * Fase 2: Adição e Subtração
 */
export function resolveTokens(tokens: string[]): number {
	if (tokens.length === 0) return 0;
	if (tokens.length === 1) {
		const val = Number(tokens[0]);
		return Number.isNaN(val) ? 0 : val;
	}

	const temp: string[] = [];

	// FASE 1: Multiplicação (*) e Divisão (/)
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		if (token === "*" || token === "/") {
			const prev = Number(temp.pop());
			const next = Number(tokens[i + 1]);

			if (Number.isNaN(prev) || Number.isNaN(next)) {
				return Number.NaN;
			}

			let result = 0;
			if (token === "*") {
				result = prev * next;
			} else if (token === "/") {
				if (next === 0) {
					return Number.POSITIVE_INFINITY;
				}
				result = prev / next;
			}

			temp.push(String(result));
			i++; // pula o próximo token já consumido
		} else {
			temp.push(token);
		}
	}

	if (temp.length === 0) return 0;

	// FASE 2: Adição (+) e Subtração (-)
	let result = Number(temp[0]);

	for (let i = 1; i < temp.length; i += 2) {
		const operator = temp[i];
		const next = Number(temp[i + 1]);

		if (Number.isNaN(next)) continue;

		if (operator === "+") result += next;
		if (operator === "-") result -= next;
	}

	return result;
}
