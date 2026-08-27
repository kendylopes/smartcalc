/**
 * Parser de Linguagem Natural em Português para Comandos de Voz do SmartCalc
 * Reconhece itens de mercado ("2 leites a 4,50") e expressões matemáticas ("50 mais 25").
 */

const NUMBER_WORDS: Record<string, number> = {
	um: 1,
	uma: 1,
	dois: 2,
	duas: 2,
	três: 3,
	tres: 3,
	quatro: 4,
	cinco: 5,
	seis: 6,
	sete: 7,
	oito: 8,
	nove: 9,
	dez: 10,
	onze: 11,
	doze: 12,
	treze: 13,
	quatorze: 14,
	catorze: 14,
	quinze: 15,
	dezesseis: 16,
	dezessete: 17,
	dezoito: 18,
	dezenove: 19,
	vinte: 20,
	trinta: 30,
	quarenta: 40,
	cinquenta: 50,
	sessenta: 60,
	setenta: 70,
	oitenta: 80,
	noventa: 90,
	cem: 100,
	cento: 100,
	duzentos: 200,
	trezentos: 300,
	quatrocentos: 400,
	quinhentos: 500,
	seiscentos: 600,
	setecentos: 700,
	oitocentos: 800,
	novecentos: 900,
	mil: 1000,
};

/**
 * Converte palavras de números em português para número real
 * Ex: "quatro e cinquenta" -> 4.5
 * Ex: "vinte e cinco reais e noventa centavos" -> 25.9
 * Ex: "três" -> 3
 */
export function parseSpokenNumber(text: string): number | null {
	if (!text) return null;
	const clean = text
		.toLowerCase()
		.replace(/r\$/g, "")
		.replace(/reais/g, " ")
		.replace(/real/g, " ")
		.replace(/centavos/g, " ")
		.replace(/centavo/g, " ")
		.replace(/,/g, ".")
		.trim();

	// Se já for numérico direto como "4.50" ou "25"
	if (/^[0-9]+(\.[0-9]+)?$/.test(clean)) {
		return Number.parseFloat(clean);
	}

	// Caso com "vírgula" ou "ponto" (ex: "quatro vírgula cinquenta" ou "quatro e cinquenta")
	const parts = clean.split(/\s+vírgula\s+|\s+virgula\s+|\s+ponto\s+/);
	if (parts.length === 2) {
		const intPart = parseWordSequence(parts[0]);
		let decStr = parts[1].replace(/\D/g, "");
		if (!decStr) {
			const decNum = parseWordSequence(parts[1]);
			decStr = decNum !== null ? String(decNum) : "";
		}
		if (intPart !== null && decStr) {
			return Number.parseFloat(`${intPart}.${decStr}`);
		}
	}

	// Caso clássico com "e" para centavos (ex: "quatro e cinquenta", "dez e noventa e nove")
	return parseWordSequence(clean);
}

function parseWordSequence(text: string): number | null {
	const words = text
		.toLowerCase()
		.split(/\s+/)
		.filter((w) => w && w !== "e");
	if (words.length === 0) return null;

	let total = 0;
	let current = 0;
	let hasAny = false;

	for (const word of words) {
		// Se for dígito direto como "50"
		if (/^[0-9]+(\.[0-9]+)?$/.test(word)) {
			current += Number.parseFloat(word);
			hasAny = true;
			continue;
		}

		const val = NUMBER_WORDS[word];
		if (val !== undefined) {
			hasAny = true;
			if (val === 1000) {
				total += (current || 1) * 1000;
				current = 0;
			} else {
				current += val;
			}
		}
	}

	if (!hasAny) return null;
	return total + current;
}

export type VoiceParseResult =
	| {
			type: "product";
			productName: string;
			unitPrice: string;
			quantity: number;
			subtotal: number;
			rawTranscript: string;
	  }
	| {
			type: "math";
			expression: string;
			rawTranscript: string;
	  }
	| {
			type: "price";
			price: string;
			rawTranscript: string;
	  };

/**
 * Analisa a transcrição de voz e identifica se é produto com preço/quantidade ou conta matemática
 */
export function parseVoiceCommand(transcript: string): VoiceParseResult | null {
	if (!transcript || !transcript.trim()) return null;
	const text = transcript.trim();
	const lower = text.toLowerCase();

	// 1. Tentar detectar se é produto de mercado (ex: "2 leites a 4,50", "três pães por 1 real", "carne por 35 reais")
	const marketRegex =
		/^(?:(um|uma|dois|duas|três|tres|quatro|cinco|seis|sete|oito|nove|dez|[0-9]+)\s+)?(.+?)\s+(?:a|por|de|custando|no valor de)\s+([0-9.,]+|[a-zá-ú\s]+)/i;
	const match = lower.match(marketRegex);

	if (match) {
		const qtyStr = match[1];
		let rawName = match[2].trim();
		const priceStr = match[3].trim();

		let quantity = 1;
		if (qtyStr) {
			if (/^[0-9]+$/.test(qtyStr)) {
				quantity = Number.parseInt(qtyStr, 10);
			} else if (NUMBER_WORDS[qtyStr]) {
				quantity = NUMBER_WORDS[qtyStr];
			}
		}

		// Limpa conectivos comuns no nome
		rawName = rawName
			.replace(/^(caixas?|garrafas?|pacotes?|quilos?|kg|litros?|unidades?|un)\s+de\s+/i, "")
			.replace(/^(caixas?|garrafas?|pacotes?|quilos?|kg|litros?|unidades?|un)\s+/i, "");

		// Capitaliza o nome do produto
		const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

		// Extrai o preço
		let priceNum = 0;
		const directPriceMatch = priceStr.match(/([0-9]+(?:[.,][0-9]{1,2})?)/);
		if (directPriceMatch) {
			priceNum = Number.parseFloat(directPriceMatch[1].replace(",", "."));
		} else {
			const spokenNum = parseSpokenNumber(priceStr);
			if (spokenNum !== null) {
				priceNum = spokenNum;
			}
		}

		if (priceNum > 0 && formattedName.length >= 2) {
			const unitPriceFormatted = priceNum.toLocaleString("pt-BR", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
			return {
				type: "product",
				productName: formattedName,
				unitPrice: unitPriceFormatted,
				quantity: Math.max(1, quantity),
				subtotal: Math.round(priceNum * quantity * 100) / 100,
				rawTranscript: text,
			};
		}
	}

	// 2. Tentar detectar operações matemáticas simples (ex: "50 mais 20", "100 menos 35", "5 vezes 8", "40 dividido por 2")
	let mathExp = lower
		.replace(/\s+mais\s+/g, " + ")
		.replace(/\s+menos\s+/g, " - ")
		.replace(/\s+vezes\s+|\s+multiplicado por\s+/g, " * ")
		.replace(/\s+dividido por\s+|\s+sobre\s+/g, " / ")
		.replace(/\s+por cento\s+/g, "%")
		.replace(/,/g, ".");

	// Substitui números por extenso por dígitos
	for (const [w, val] of Object.entries(NUMBER_WORDS)) {
		const reg = new RegExp(`\\b${w}\\b`, "g");
		mathExp = mathExp.replace(reg, String(val));
	}

	// Limpa caracteres estranhos deixando só números e operadores matemáticos
	const cleanMath = mathExp.replace(/[^0-9+\-*/.%() ]/g, "").trim();
	if (/^[0-9]+(\.[0-9]+)?\s*[+\-*/]\s*[0-9]+/.test(cleanMath)) {
		return {
			type: "math",
			expression: cleanMath.replace(/\s+/g, ""),
			rawTranscript: text,
		};
	}

	// 3. Se falou apenas um número/preço (ex: "vinte e cinco e cinquenta" ou "12,90")
	const singleNum = parseSpokenNumber(lower);
	if (singleNum !== null && singleNum > 0) {
		return {
			type: "price",
			price: singleNum.toLocaleString("pt-BR", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			}),
			rawTranscript: text,
		};
	}

	return null;
}
