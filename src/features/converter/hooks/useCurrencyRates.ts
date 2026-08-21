import { useCallback, useEffect, useState } from "react";
import { DEFAULT_CURRENCIES } from "../constants";
import type { CurrencyRate } from "../types";

const CACHE_KEY = "smart-calc-currency-rates";
const CACHE_TIMESTAMP_KEY = "smart-calc-currency-rates-timestamp";
const CACHE_EXPIRATION_MS = 1000 * 60 * 30; // 30 minutos

export function useCurrencyRates() {
	const [currencies, setCurrencies] = useState<CurrencyRate[]>(() => {
		try {
			const cached = localStorage.getItem(CACHE_KEY);
			if (cached) {
				const parsed = JSON.parse(cached);
				if (Array.isArray(parsed) && parsed.length > 0) {
					return parsed;
				}
			}
		} catch {
			// Ignore
		}
		return DEFAULT_CURRENCIES;
	});

	const [isLoading, setIsLoading] = useState(false);
	const [lastUpdated, setLastUpdated] = useState<string | null>(() => {
		try {
			return localStorage.getItem(CACHE_TIMESTAMP_KEY);
		} catch {
			return null;
		}
	});

	const fetchRates = useCallback(async (force = false) => {
		try {
			const cachedTime = localStorage.getItem(CACHE_TIMESTAMP_KEY);
			if (!force && cachedTime) {
				const diff = Date.now() - new Date(cachedTime).getTime();
				if (diff < CACHE_EXPIRATION_MS) {
					return; // Cache ainda válido
				}
			}

			setIsLoading(true);
			// AwesomeAPI (gratuita, sem necessidade de API key, rápida e confiável)
			const res = await fetch(
				"https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL,CAD-BRL,JPY-BRL,ARS-BRL,BTC-BRL,ETH-BRL",
			);

			if (!res.ok) throw new Error("Falha ao obter cotações");

			const data = await res.json();

			const updatedCurrencies: CurrencyRate[] = DEFAULT_CURRENCIES.map((curr) => {
				if (curr.code === "BRL") return curr;

				const pairKey = `${curr.code}BRL`;
				if (data[pairKey] && data[pairKey].bid) {
					const bidValue = Number.parseFloat(data[pairKey].bid);
					return {
						...curr,
						rateToBrl: bidValue,
					};
				}
				return curr;
			});

			const nowISO = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
			setCurrencies(updatedCurrencies);
			setLastUpdated(nowISO);

			try {
				localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCurrencies));
				localStorage.setItem(CACHE_TIMESTAMP_KEY, nowISO);
			} catch (e) {
				console.error(e);
			}
		} catch {
			// Mantém as moedas atuais ou padrão em caso de erro/offline
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRates();
	}, [fetchRates]);

	return {
		currencies,
		isLoading,
		lastUpdated,
		refreshRates: () => fetchRates(true),
	};
}
