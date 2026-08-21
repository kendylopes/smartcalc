import { resolveTokens } from "./resolve";
import { tokenize } from "./tokenize";

/**
 * Avalia uma expressão matemática de forma segura e precisa.
 * Suporta parênteses aninhados, multiplicação implícita, constantes (π)
 * e correção de precisão IEEE 754.
 */
export function evaluateExpression(expression: string): string {
	try {
		if (!expression || expression.trim() === "") return "0";

		let sanitized = expression.trim();

		// Substitui constantes matemáticas
		sanitized = sanitized.replaceAll("π", String(Math.PI));

		// Multiplicação implícita para parênteses e constantes:
		// ex: 2(3) -> 2*(3)  |  (2)(3) -> (2)*(3)  |  (3)2 -> (3)*2
		sanitized = sanitized.replace(/(\d)(\()/g, "$1*$2");
		sanitized = sanitized.replace(/(\))(\d)/g, "$1*$2");
		sanitized = sanitized.replace(/(\))(\()/g, "$1*$2");

		// Balanceamento automático de parênteses abertos no final
		const openCount = (sanitized.match(/\(/g) || []).length;
		const closeCount = (sanitized.match(/\)/g) || []).length;
		if (openCount > closeCount) {
			sanitized += ")".repeat(openCount - closeCount);
		}

		// Resolve parênteses do mais interno para o mais externo
		let loopCount = 0;
		while (sanitized.includes("(") && sanitized.includes(")") && loopCount < 30) {
			loopCount++;
			const match = sanitized.match(/\(([^()]+)\)/);
			if (!match) break;

			const innerResult = evaluateExpression(match[1]);
			if (innerResult === "Error") return "Error";

			sanitized = sanitized.replace(match[0], innerResult);
		}

		// Se ainda restarem parênteses órfãos após o loop, trata como erro
		if (sanitized.includes("(") || sanitized.includes(")")) {
			return "Error";
		}

		const tokens = tokenize(sanitized);
		const result = resolveTokens(tokens);

		if (!Number.isFinite(result) || Number.isNaN(result)) {
			return "Error";
		}

		// Evita imprecisão IEEE 754 mantendo até 10 casas decimais significativas
		const precisionFactor = 1e10;
		const rounded = Math.round((result + Number.EPSILON) * precisionFactor) / precisionFactor;

		// Formata e converte para string
		return String(rounded);
	} catch {
		return "Error";
	}
}
