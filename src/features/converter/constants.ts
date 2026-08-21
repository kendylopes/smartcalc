import type { CurrencyRate, UnitCategory, UnitOption } from "./types";

export const DEFAULT_CURRENCIES: CurrencyRate[] = [
	{ code: "BRL", name: "Real Brasileiro", symbol: "R$", flag: "🇧🇷", rateToBrl: 1.0 },
	{ code: "USD", name: "Dólar Americano", symbol: "$", flag: "🇺🇸", rateToBrl: 5.65 },
	{ code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rateToBrl: 6.15 },
	{ code: "GBP", name: "Libra Esterlina", symbol: "£", flag: "🇬🇧", rateToBrl: 7.25 },
	{ code: "JPY", name: "Iene Japonês", symbol: "¥", flag: "🇯🇵", rateToBrl: 0.038 },
	{ code: "CAD", name: "Dólar Canadense", symbol: "C$", flag: "🇨🇦", rateToBrl: 4.12 },
	{ code: "ARS", name: "Peso Argentino", symbol: "$", flag: "🇦🇷", rateToBrl: 0.0058 },
	{ code: "BTC", name: "Bitcoin", symbol: "₿", flag: "🪙", rateToBrl: 375000.0 },
	{ code: "ETH", name: "Ethereum", symbol: "Ξ", flag: "💎", rateToBrl: 16500.0 },
];

export const UNIT_CATEGORIES: { id: UnitCategory; label: string; iconName: string }[] = [
	{ id: "currency", label: "Moedas", iconName: "Coins" },
	{ id: "length", label: "Comprimento", iconName: "Ruler" },
	{ id: "mass", label: "Peso", iconName: "Scale" },
	{ id: "temperature", label: "Temperatura", iconName: "Thermometer" },
	{ id: "digital", label: "Dados", iconName: "HardDrive" },
	{ id: "speed", label: "Velocidade", iconName: "Gauge" },
	{ id: "volume", label: "Volume", iconName: "Beaker" },
	{ id: "area", label: "Área", iconName: "Square" },
];

// Unidades de Comprimento (Base: Metro - m)
export const LENGTH_UNITS: UnitOption[] = [
	{ id: "m", name: "Metros", symbol: "m", factorToBase: 1 },
	{ id: "km", name: "Quilômetros", symbol: "km", factorToBase: 1000 },
	{ id: "cm", name: "Centímetros", symbol: "cm", factorToBase: 0.01 },
	{ id: "mm", name: "Milímetros", symbol: "mm", factorToBase: 0.001 },
	{ id: "in", name: "Polegadas", symbol: "in", factorToBase: 0.0254 },
	{ id: "ft", name: "Pés", symbol: "ft", factorToBase: 0.3048 },
	{ id: "yd", name: "Jardas", symbol: "yd", factorToBase: 0.9144 },
	{ id: "mi", name: "Milhas", symbol: "mi", factorToBase: 1609.344 },
];

// Unidades de Massa / Peso (Base: Quilograma - kg)
export const MASS_UNITS: UnitOption[] = [
	{ id: "kg", name: "Quilogramas", symbol: "kg", factorToBase: 1 },
	{ id: "g", name: "Gramas", symbol: "g", factorToBase: 0.001 },
	{ id: "mg", name: "Miligramas", symbol: "mg", factorToBase: 0.000001 },
	{ id: "t", name: "Toneladas", symbol: "t", factorToBase: 1000 },
	{ id: "lb", name: "Libras", symbol: "lb", factorToBase: 0.45359237 },
	{ id: "oz", name: "Onças", symbol: "oz", factorToBase: 0.028349523125 },
];

// Unidades de Temperatura
export const TEMPERATURE_UNITS: UnitOption[] = [
	{ id: "c", name: "Celsius", symbol: "°C" },
	{ id: "f", name: "Fahrenheit", symbol: "°F" },
	{ id: "k", name: "Kelvin", symbol: "K" },
];

// Unidades de Dados Digitais (Base: Byte - B)
export const DIGITAL_UNITS: UnitOption[] = [
	{ id: "b", name: "Bytes", symbol: "B", factorToBase: 1 },
	{ id: "kb", name: "Kilobytes", symbol: "KB", factorToBase: 1024 },
	{ id: "mb", name: "Megabytes", symbol: "MB", factorToBase: 1024 ** 2 },
	{ id: "gb", name: "Gigabytes", symbol: "GB", factorToBase: 1024 ** 3 },
	{ id: "tb", name: "Terabytes", symbol: "TB", factorToBase: 1024 ** 4 },
	{ id: "pb", name: "Petabytes", symbol: "PB", factorToBase: 1024 ** 5 },
];

// Unidades de Velocidade (Base: km/h)
export const SPEED_UNITS: UnitOption[] = [
	{ id: "kmh", name: "Quilômetros por hora", symbol: "km/h", factorToBase: 1 },
	{ id: "ms", name: "Metros por segundo", symbol: "m/s", factorToBase: 3.6 },
	{ id: "mph", name: "Milhas por hora", symbol: "mph", factorToBase: 1.60934 },
	{ id: "knot", name: "Nós", symbol: "kn", factorToBase: 1.852 },
];

// Unidades de Volume (Base: Litro - L)
export const VOLUME_UNITS: UnitOption[] = [
	{ id: "l", name: "Litros", symbol: "L", factorToBase: 1 },
	{ id: "ml", name: "Mililitros", symbol: "mL", factorToBase: 0.001 },
	{ id: "m3", name: "Metros cúbicos", symbol: "m³", factorToBase: 1000 },
	{ id: "gal", name: "Galões (US)", symbol: "gal", factorToBase: 3.78541 },
	{ id: "cup", name: "Xícaras", symbol: "cup", factorToBase: 0.24 },
];

// Unidades de Área (Base: Metro quadrado - m²)
export const AREA_UNITS: UnitOption[] = [
	{ id: "m2", name: "Metros quadrados", symbol: "m²", factorToBase: 1 },
	{ id: "km2", name: "Quilômetros quadrados", symbol: "km²", factorToBase: 1e6 },
	{ id: "cm2", name: "Centímetros quadrados", symbol: "cm²", factorToBase: 0.0001 },
	{ id: "ha", name: "Hectares", symbol: "ha", factorToBase: 10000 },
	{ id: "ac", name: "Acres", symbol: "ac", factorToBase: 4046.86 },
	{ id: "sqft", name: "Pés quadrados", symbol: "sq ft", factorToBase: 0.092903 },
];
