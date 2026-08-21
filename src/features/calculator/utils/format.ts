/**
 * Utilitários de formatação e tokenização para exibição matemática
 * Formatado para o padrão do Brasil (pt-BR): ponto como milhar e vírgula como decimal
 */

export type DisplayToken = {
	type: "number" | "operator" | "parenthesis" | "other";
	raw: string;
	formatted: string;
};

/**
 * Formata um número individual ou resultado no padrão pt-BR
 * Ex: "1234567.89" -> "1.234.567,89"
 * Ex: "2.30" -> "2,30"
 * Ex: "1000." -> "1.000,"
 * Ex: "1.23e+15" -> "1,23 × 10¹⁵"
 */
export function formatNumberPtBR(numStr: string): string {
	if (!numStr || numStr === "undefined" || numStr === "null" || numStr === "NaN") return "";
	if (numStr === "-") return "−";
	if (numStr === "Error") return "Erro";

	const isNegative = numStr.startsWith("-") || numStr.startsWith("−");
	const cleanStr = isNegative ? numStr.slice(1) : numStr;

	// Suporte seguro a notação científica com expoente sobrescrito (ex: 1.23e+15 ou 5e-8)
	if (/^[0-9]+(\.[0-9]+)?e[+-]?[0-9]+$/i.test(cleanStr)) {
		const [coeff, exp] = cleanStr.toLowerCase().split("e");
		const formattedCoeff = formatNumberPtBR(coeff);
		const expNum = Number.parseInt(exp, 10);
		if (!Number.isNaN(expNum)) {
			const expSuper = String(expNum)
				.replace(/-/g, "⁻")
				.replace(/\+/g, "")
				.replace(/0/g, "⁰")
				.replace(/1/g, "¹")
				.replace(/2/g, "²")
				.replace(/3/g, "³")
				.replace(/4/g, "⁴")
				.replace(/5/g, "⁵")
				.replace(/6/g, "⁶")
				.replace(/7/g, "⁷")
				.replace(/8/g, "⁸")
				.replace(/9/g, "⁹");
			return `${isNegative ? "−" : ""}${formattedCoeff} × 10${expSuper}`;
		}
	}

	// Identifica separador decimal (, ou .)
	const hasComma = cleanStr.includes(",");
	const [integerPart, decimalPart] = hasComma ? cleanStr.split(",") : cleanStr.split(".");

	if (integerPart === undefined) return "";

	// Limpa pontos prévios para evitar duplicação
	const rawInt = integerPart.replace(/\./g, "");
	// Adiciona ponto a cada 3 dígitos (milhar pt-BR)
	const formattedInt = rawInt.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

	const prefix = isNegative ? "−" : "";

	if (decimalPart !== undefined) {
		return `${prefix}${formattedInt},${decimalPart}`;
	}

	return `${prefix}${formattedInt}`;
}

/**
 * Divide uma expressão matemática em tokens estruturados
 * permitindo estilização individual de números, operadores e parênteses.
 */
export function tokenizeDisplay(expression: string): DisplayToken[] {
	if (!expression || expression === "undefined" || expression === "null") return [];
	if (expression === "Error") {
		return [{ type: "other", raw: "Error", formatted: "Erro" }];
	}

	const tokens: DisplayToken[] = [];
	const operators = ["+", "-", "*", "/"];
	let currentNum = "";

	for (let i = 0; i < expression.length; i++) {
		const char = expression[i];

		if (char === "(" || char === ")") {
			if (currentNum) {
				tokens.push({
					type: "number",
					raw: currentNum,
					formatted: formatNumberPtBR(currentNum),
				});
				currentNum = "";
			}
			tokens.push({
				type: "parenthesis",
				raw: char,
				formatted: char,
			});
			continue;
		}

		if (operators.includes(char)) {
			if (currentNum) {
				tokens.push({
					type: "number",
					raw: currentNum,
					formatted: formatNumberPtBR(currentNum),
				});
				currentNum = "";
			}

			let opSymbol = char;
			if (char === "*") opSymbol = "×";
			if (char === "/") opSymbol = "÷";
			if (char === "-") opSymbol = "−";

			tokens.push({
				type: "operator",
				raw: char,
				formatted: opSymbol,
			});
			continue;
		}

		currentNum += char;
	}

	if (currentNum) {
		tokens.push({
			type: "number",
			raw: currentNum,
			formatted: formatNumberPtBR(currentNum),
		});
	}

	return tokens;
}

/**
 * Formata uma expressão completa para exibição limpa em linha única
 * Ex: "(2.5*4)+1000" -> "(2,5 × 4) + 1.000"
 */
export function formatDisplay(expression: string): string {
	if (!expression || expression === "undefined") return "";
	if (expression === "Error") return "Erro";

	const tokens = tokenizeDisplay(expression);
	return tokens
		.map((t) => {
			if (t.type === "operator") {
				return ` ${t.formatted} `;
			}
			return t.formatted;
		})
		.join("");
}
