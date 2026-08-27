import React, { createContext, useContext, useMemo, useState } from "react";
import { enUS } from "./translations/enUS";
import { esES } from "./translations/esES";
import { ptBR } from "./translations/ptBR";
import type { Language, LanguageInfo, TranslationDictionary } from "./types";

const STORAGE_KEY = "smartcalc_language";

export const AVAILABLE_LANGUAGES: LanguageInfo[] = [
	{
		code: "pt-BR",
		name: "Português",
		nativeName: "Português (BR)",
		flag: "🇧🇷",
		currencySymbol: "R$",
		currencyCode: "BRL",
		decimalSeparator: ",",
		thousandSeparator: ".",
	},
	{
		code: "en-US",
		name: "English",
		nativeName: "English (US)",
		flag: "🇺🇸",
		currencySymbol: "$",
		currencyCode: "USD",
		decimalSeparator: ".",
		thousandSeparator: ",",
	},
	{
		code: "es-ES",
		name: "Español",
		nativeName: "Español",
		flag: "🇪🇸",
		currencySymbol: "€",
		currencyCode: "EUR",
		decimalSeparator: ",",
		thousandSeparator: ".",
	},
];

type I18nContextType = {
	language: Language;
	currentLanguageInfo: LanguageInfo;
	languages: LanguageInfo[];
	setLanguage: (lang: Language) => void;
	t: TranslationDictionary;
	formatMoney: (val: number | string) => string;
	formatNumber: (val: number | string, decimals?: number) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [language, setLanguageState] = useState<Language>(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY) as Language;
			if (saved && (saved === "pt-BR" || saved === "en-US" || saved === "es-ES")) {
				return saved;
			}
			const navLang = navigator.language;
			if (navLang.startsWith("en")) return "en-US";
			if (navLang.startsWith("es")) return "es-ES";
		} catch {
			// fallback
		}
		return "pt-BR";
	});

	const setLanguage = (lang: Language) => {
		setLanguageState(lang);
		try {
			localStorage.setItem(STORAGE_KEY, lang);
		} catch {
			// ignore storage errors
		}
	};

	const currentLanguageInfo = useMemo(() => {
		return AVAILABLE_LANGUAGES.find((l) => l.code === language) || AVAILABLE_LANGUAGES[0];
	}, [language]);

	const t = useMemo(() => {
		switch (language) {
			case "en-US":
				return enUS;
			case "es-ES":
				return esES;
			case "pt-BR":
			default:
				return ptBR;
		}
	}, [language]);

	const formatMoney = (val: number | string): string => {
		const num = typeof val === "string" ? Number(val.replace(",", ".")) : val;
		if (isNaN(num)) return `${currentLanguageInfo.currencySymbol} 0,00`;

		return new Intl.NumberFormat(language, {
			style: "currency",
			currency: currentLanguageInfo.currencyCode,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(num);
	};

	const formatNumber = (val: number | string, decimals = 2): string => {
		const num = typeof val === "string" ? Number(val.replace(",", ".")) : val;
		if (isNaN(num)) return "0";

		return new Intl.NumberFormat(language, {
			minimumFractionDigits: 0,
			maximumFractionDigits: decimals,
		}).format(num);
	};

	return (
		<I18nContext.Provider
			value={{
				language,
				currentLanguageInfo,
				languages: AVAILABLE_LANGUAGES,
				setLanguage,
				t,
				formatMoney,
				formatNumber,
			}}
		>
			{children}
		</I18nContext.Provider>
	);
};

export const useI18n = (): I18nContextType => {
	const context = useContext(I18nContext);
	if (!context) {
		throw new Error("useI18n must be used within an I18nProvider");
	}
	return context;
};
