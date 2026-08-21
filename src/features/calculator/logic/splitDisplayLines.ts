export function splitDisplayLines(value: string, maxChars = 14): string[] {
	if (!value) {
		return [];
	}

	// separa números e operadores
	const tokens = value.match(/\d+\.?\d*|[+\-*/]/g) ?? [];

	const lines: string[] = [];

	let currentLine = "";

	for (const token of tokens) {
		const nextLine = currentLine + token;

		// ainda cabe
		if (nextLine.length <= maxChars) {
			currentLine = nextLine;

			continue;
		}

		// quebra inteligente:
		// nunca deixa operador sozinho
		if (currentLine) {
			lines.push(currentLine);
		}

		currentLine = token;
	}

	if (currentLine) {
		lines.push(currentLine);
	}

	// mantém só as últimas 3 linhas
	return lines.slice(-3);
}
