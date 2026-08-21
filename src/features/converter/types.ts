export type UnitCategory =
	| "currency"
	| "length"
	| "mass"
	| "temperature"
	| "digital"
	| "speed"
	| "volume"
	| "area";

export type UnitOption = {
	id: string;
	name: string;
	symbol: string;
	factorToBase?: number; // Para conversões lineares: valor * factorToBase = valor em base
};

export type CurrencyRate = {
	code: string; // Ex: USD
	name: string;
	symbol: string;
	flag: string;
	rateToBrl: number; // Ex: 1 USD = 5.65 BRL
	lastUpdated?: string;
};
