import { memo, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowDownUp,
	ArrowRight,
	Beaker,
	Check,
	ChevronDown,
	Coins,
	Copy,
	Gauge,
	HardDrive,
	RefreshCw,
	Ruler,
	Scale,
	Square,
	Thermometer,
	X,
} from "lucide-react";
import type { ThemeConfig } from "@/features/calculator/hooks/useThemes";
import { formatNumberPtBR } from "@/features/calculator/utils/format";
import {
	AREA_UNITS,
	DIGITAL_UNITS,
	LENGTH_UNITS,
	MASS_UNITS,
	SPEED_UNITS,
	TEMPERATURE_UNITS,
	UNIT_CATEGORIES,
	VOLUME_UNITS,
} from "../constants";
import { useCurrencyRates } from "../hooks/useCurrencyRates";
import type { UnitCategory, UnitOption } from "../types";

type Props = {
	isOpen: boolean;
	initialValue?: string;
	onClose: () => void;
	onTransferToCalculator: (value: string) => void;
	theme?: ThemeConfig;
	onPlayClick?: () => void;
};

export const ConverterModal = memo(function ConverterModal({
	isOpen,
	initialValue = "1",
	onClose,
	onTransferToCalculator,
	theme,
	onPlayClick,
}: Props) {
	const [activeCategory, setActiveCategory] = useState<UnitCategory>("currency");
	const [inputValue, setInputValue] = useState(initialValue || "1");
	const [fromUnitId, setFromUnitId] = useState("USD");
	const [toUnitId, setToUnitId] = useState("BRL");
	const [copied, setCopied] = useState(false);

	const { currencies, isLoading: isRefreshingRates, refreshRates } = useCurrencyRates();

	// Sincroniza o valor inicial ao abrir
	useEffect(() => {
		if (isOpen) {
			const clean = initialValue && initialValue !== "0" && initialValue !== "Error" ? initialValue : "1";
			setInputValue(clean);
			setCopied(false);
		}
	}, [isOpen, initialValue]);

	// Atualiza unidades padrão ao trocar de categoria
	useEffect(() => {
		switch (activeCategory) {
			case "currency":
				setFromUnitId("USD");
				setToUnitId("BRL");
				break;
			case "length":
				setFromUnitId("km");
				setToUnitId("m");
				break;
			case "mass":
				setFromUnitId("kg");
				setToUnitId("g");
				break;
			case "temperature":
				setFromUnitId("c");
				setToUnitId("f");
				break;
			case "digital":
				setFromUnitId("gb");
				setToUnitId("mb");
				break;
			case "speed":
				setFromUnitId("kmh");
				setToUnitId("ms");
				break;
			case "volume":
				setFromUnitId("l");
				setToUnitId("ml");
				break;
			case "area":
				setFromUnitId("m2");
				setToUnitId("ha");
				break;
		}
	}, [activeCategory]);

	// Fecha modal com Escape
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	// Obter lista de opções da categoria ativa
	const currentUnitOptions = useMemo((): UnitOption[] => {
		switch (activeCategory) {
			case "currency":
				return currencies.map((c) => ({
					id: c.code,
					name: `${c.flag} ${c.code}`,
					symbol: c.symbol,
				}));
			case "length":
				return LENGTH_UNITS;
			case "mass":
				return MASS_UNITS;
			case "temperature":
				return TEMPERATURE_UNITS;
			case "digital":
				return DIGITAL_UNITS;
			case "speed":
				return SPEED_UNITS;
			case "volume":
				return VOLUME_UNITS;
			case "area":
				return AREA_UNITS;
		}
	}, [activeCategory, currencies]);

	// Motor de Conversão Universal
	const convertedResult = useMemo(() => {
		const num = Number(inputValue.replace(",", ".")) || 0;

		// 1. Moedas
		if (activeCategory === "currency") {
			const fromCurr = currencies.find((c) => c.code === fromUnitId);
			const toCurr = currencies.find((c) => c.code === toUnitId);

			if (!fromCurr || !toCurr || fromCurr.rateToBrl <= 0 || toCurr.rateToBrl <= 0) {
				return 0;
			}
			const inBrl = num * fromCurr.rateToBrl;
			const inTarget = inBrl / toCurr.rateToBrl;
			return Math.round((inTarget + Number.EPSILON) * 10000) / 10000;
		}

		// 2. Temperatura
		if (activeCategory === "temperature") {
			let celsius = num;
			if (fromUnitId === "f") celsius = ((num - 32) * 5) / 9;
			if (fromUnitId === "k") celsius = num - 273.15;

			let result = celsius;
			if (toUnitId === "f") result = (celsius * 9) / 5 + 32;
			if (toUnitId === "k") result = celsius + 273.15;
			return Math.round((result + Number.EPSILON) * 100) / 100;
		}

		// 3. Demais unidades
		const fromOpt = currentUnitOptions.find((u) => u.id === fromUnitId);
		const toOpt = currentUnitOptions.find((u) => u.id === toUnitId);

		if (!fromOpt || !toOpt || !fromOpt.factorToBase || !toOpt.factorToBase) {
			return 0;
		}

		const inBase = num * fromOpt.factorToBase;
		const inTarget = inBase / toOpt.factorToBase;
		return Math.round((inTarget + Number.EPSILON) * 100000) / 100000;
	}, [inputValue, activeCategory, fromUnitId, toUnitId, currencies, currentUnitOptions]);

	const handleSwap = () => {
		onPlayClick?.();
		setFromUnitId(toUnitId);
		setToUnitId(fromUnitId);
	};

	const handleCopy = () => {
		onPlayClick?.();
		navigator.clipboard.writeText(String(convertedResult));
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const handleTransfer = () => {
		onPlayClick?.();
		onTransferToCalculator(String(convertedResult));
		onClose();
	};

	const getCategoryIcon = (id: UnitCategory) => {
		switch (id) {
			case "currency":
				return <Coins size={14} />;
			case "length":
				return <Ruler size={14} />;
			case "mass":
				return <Scale size={14} />;
			case "temperature":
				return <Thermometer size={14} />;
			case "digital":
				return <HardDrive size={14} />;
			case "speed":
				return <Gauge size={14} />;
			case "volume":
				return <Beaker size={14} />;
			case "area":
				return <Square size={14} />;
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-black/80 backdrop-blur-md"
					/>

					{/* Modal Card Padronizado */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 15 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 15 }}
						transition={{ type: "spring", stiffness: 350, damping: 25 }}
						className="
							relative
							w-full
							max-w-md
							overflow-hidden
							rounded-[2.2rem]
							border
							border-white/10
							tech-modal
							p-4 sm:p-5
							shadow-[0_24px_70px_rgba(0,0,0,0.85)]
						"
					>
						{/* Header Padronizado */}
						<div className="flex items-center justify-between pb-3 border-b border-white/8">
							<div className="flex items-center gap-2.5">
								<div
									className={`
										p-2
										rounded-2xl
										${theme?.operatorBgActive ?? "bg-cyan-500/10"}
										border
										${theme?.operatorBorderActive ?? "border-cyan-500/20"}
										${theme?.accentText ?? "text-cyan-400"}
									`}
								>
									<Coins size={18} />
								</div>
								<div>
									<h2 className="text-base font-semibold text-white tracking-tight">
										Conversor de Moedas & Unidades
									</h2>
									<p className="text-[11px] text-zinc-400">Cotações ao vivo e conversão métrica</p>
								</div>
							</div>

							<button
								type="button"
								onClick={onClose}
								aria-label="Fechar conversor"
								className="p-1.5 rounded-2xl bg-white/4 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/6 active:scale-95 transition-all outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer"
							>
								<X size={18} />
							</button>
						</div>

						{/* Seletor de Categorias em Grid 4x2 sem corte */}
						<div className="grid grid-cols-4 gap-1.5 pt-3 pb-2">
							{UNIT_CATEGORIES.map((cat) => (
								<button
									key={cat.id}
									type="button"
									onClick={() => {
										onPlayClick?.();
										setActiveCategory(cat.id);
									}}
									className={`
										flex
										flex-col
										items-center
										justify-center
										gap-1
										py-2
										px-1
										rounded-2xl
										text-[11px]
										font-medium
										transition-all
										active:scale-95
										cursor-pointer
										${
											activeCategory === cat.id
												? `${theme?.accentText ?? "text-cyan-300"} bg-white/12 border border-white/20 font-semibold shadow-sm`
												: "text-zinc-400 bg-white/3 border border-white/5 hover:text-white hover:bg-white/6"
										}
									`}
								>
									{getCategoryIcon(cat.id)}
									<span className="truncate w-full text-center">{cat.label}</span>
								</button>
							))}
						</div>

						{/* Form Content */}
						<div className="space-y-3 py-2">
							{/* Campo 1: Valor de Origem */}
							<div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/8 space-y-1.5">
								<div className="flex items-center justify-between text-xs text-zinc-400">
									<span>De (Valor de Entrada)</span>
									<div className="relative">
										<select
											value={fromUnitId}
											onChange={(e) => setFromUnitId(e.target.value)}
											className="
												appearance-none
												bg-zinc-800
												text-white
												text-xs
												font-medium
												py-1.5
												pl-2.5
												pr-6
												rounded-xl
												border
												border-white/10
												outline-none
												cursor-pointer
												hover:bg-zinc-700
												transition-colors
											"
										>
											{currentUnitOptions.map((opt) => (
												<option key={opt.id} value={opt.id} className="bg-zinc-900 text-white">
													{opt.name} ({opt.symbol})
												</option>
											))}
										</select>
										<div className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400">
											<ChevronDown size={12} />
										</div>
									</div>
								</div>

								<input
									type="text"
									inputMode="decimal"
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value.replace(/[^0-9.,-]/g, ""))}
									placeholder="0"
									className="
										w-full
										bg-transparent
										text-2xl sm:text-3xl
										font-light
										text-white
										tracking-tight
										outline-none
										border-b
										border-white/15
										focus:border-cyan-400
										pb-0.5
										transition-colors
										tabular-nums
									"
								/>
							</div>

							{/* Botão de Inverter / Swap */}
							<div className="flex justify-center -my-1 relative z-10">
								<button
									type="button"
									onClick={handleSwap}
									title="Inverter unidades"
									className="
										p-2
										rounded-full
										bg-zinc-800
										hover:bg-zinc-700
										text-zinc-300
										hover:text-white
										border
										border-white/15
										shadow-md
										active:scale-90
										transition-all
										cursor-pointer
									"
								>
									<ArrowDownUp size={14} />
								</button>
							</div>

							{/* Campo 2: Resultado de Destino */}
							<div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
								<div className="flex items-center justify-between text-xs text-emerald-300">
									<span>Para (Resultado Convertido)</span>
									<div className="relative">
										<select
											value={toUnitId}
											onChange={(e) => setToUnitId(e.target.value)}
											className="
												appearance-none
												bg-zinc-800
												text-white
												text-xs
												font-medium
												py-1.5
												pl-2.5
												pr-6
												rounded-xl
												border
												border-white/10
												outline-none
												cursor-pointer
												hover:bg-zinc-700
												transition-colors
											"
										>
											{currentUnitOptions.map((opt) => (
												<option key={opt.id} value={opt.id} className="bg-zinc-900 text-white">
													{opt.name} ({opt.symbol})
												</option>
											))}
										</select>
										<div className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400">
											<ChevronDown size={12} />
										</div>
									</div>
								</div>

								<div className="flex items-center justify-between gap-2">
									<div className="text-2xl sm:text-3xl font-light text-emerald-400 tracking-tight tabular-nums truncate">
										{formatNumberPtBR(String(convertedResult))}
									</div>

									<button
										type="button"
										onClick={handleCopy}
										title="Copiar resultado"
										className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-emerald-300 transition-colors cursor-pointer shrink-0"
									>
										{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
									</button>
								</div>
							</div>

							{/* Câmbio Refresh Toolbar (Se Moedas) */}
							{activeCategory === "currency" && (
								<div className="flex items-center justify-between px-1 text-[11px] text-zinc-400">
									<span>Cotações online via AwesomeAPI</span>
									<button
										type="button"
										onClick={refreshRates}
										disabled={isRefreshingRates}
										className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer disabled:opacity-50"
									>
										<RefreshCw size={11} className={isRefreshingRates ? "animate-spin" : ""} />
										<span>{isRefreshingRates ? "Atualizando..." : "Atualizar"}</span>
									</button>
								</div>
							)}
						</div>

						{/* Footer Actions Padronizado */}
						<div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/8">
							<button
								type="button"
								onClick={onClose}
								className="
									w-full
									py-3
									rounded-2xl
									bg-white/6
									hover:bg-white/10
									text-zinc-300
									hover:text-white
									text-xs
									font-medium
									border
									border-white/8
									transition-all
									active:scale-95
									outline-none
									cursor-pointer
								"
							>
								Fechar
							</button>

							<button
								type="button"
								onClick={handleTransfer}
								className={`
									w-full
									py-3
									rounded-2xl
									flex
									items-center
									justify-center
									gap-1.5
									${theme?.equalBg ?? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]"}
									text-xs
									font-semibold
									transition-all
									active:scale-95
									outline-none
									cursor-pointer
								`}
							>
								<ArrowRight size={14} />
								<span>Usar no Visor</span>
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});
