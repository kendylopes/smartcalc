import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Fuel, Gauge, X } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ThemeConfig } from "../hooks/useThemes";
import { formatCurrencyInput, formatNumberPtBR, parseCurrencyToNumber } from "../utils/format";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onTransferToCalculator: (value: string) => void;
	theme?: ThemeConfig;
	onPlayClick?: () => void;
	onPlayConfirm?: () => void;
};

export const FuelCalculatorModal = memo(function FuelCalculatorModal({
	isOpen,
	onClose,
	onTransferToCalculator,
	theme,
	onPlayClick,
	onPlayConfirm,
}: Props) {
	const [ethanolPrice, setEthanolPrice] = useState("3.49");
	const [gasolinePrice, setGasolinePrice] = useState("5.79");
	const [isCustomConsumption, setIsCustomConsumption] = useState(false);
	const [ethanolKmL, setEthanolKmL] = useState("8.5");
	const [gasolineKmL, setGasolineKmL] = useState("12.0");
	const tankSize = 50;

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	// Cálculos do combustível
	const result = useMemo(() => {
		const pe = parseCurrencyToNumber(ethanolPrice);
		const pg = parseCurrencyToNumber(gasolinePrice);
		const tank = tankSize;

		if (pe <= 0 || pg <= 0) return null;

		let threshold = 0.7; // Padrão 70%
		if (isCustomConsumption) {
			const ke = Number(ethanolKmL.replace(",", ".")) || 0;
			const kg = Number(gasolineKmL.replace(",", ".")) || 0;
			if (ke > 0 && kg > 0) {
				threshold = ke / kg;
			}
		}

		const ratio = pe / pg;
		const ratioPercent = Math.round(ratio * 1000) / 10;
		const thresholdPercent = Math.round(threshold * 1000) / 10;

		const isEthanolBetter = ratio <= threshold;
		const winner = isEthanolBetter ? "etanol" : "gasolina";

		// Estimativa de custo de um tanque
		const totalEthanol = pe * tank;
		const totalGasoline = pg * tank;

		const costPerKmEthanol =
			pe / (isCustomConsumption ? Number(ethanolKmL.replace(",", ".")) || 8.5 : 8.5);
		const costPerKmGasoline =
			pg / (isCustomConsumption ? Number(gasolineKmL.replace(",", ".")) || 12 : 12);

		const savingsPerKm = Math.abs(costPerKmGasoline - costPerKmEthanol);
		const savings500km = Math.round(savingsPerKm * 500 * 100) / 100;

		return {
			ratioPercent,
			thresholdPercent,
			winner,
			isEthanolBetter,
			pe,
			pg,
			totalEthanol,
			totalGasoline,
			savings500km,
		};
	}, [ethanolPrice, gasolinePrice, isCustomConsumption, ethanolKmL, gasolineKmL, tankSize]);

	const handleTransfer = () => {
		if (!result) return;
		onPlayConfirm?.();
		const val = result.isEthanolBetter ? String(result.pe) : String(result.pg);
		onTransferToCalculator(val);
		toast.success(
			`Preço do ${result.winner === "etanol" ? "Etanol" : "Gasolina"} (R$ ${formatNumberPtBR(val)}) transferido para a calculadora!`,
		);
		onClose();
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

					{/* Card Modal */}
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
							flex
							flex-col
							max-h-[92vh]
						"
					>
						{/* Header */}
						<div className="flex items-center justify-between pb-3 border-b border-white/8">
							<div className="flex items-center gap-2.5">
								<div
									className={`p-2 rounded-2xl ${theme?.operatorBgActive ?? "bg-cyan-500/10"} ${theme?.accentText ?? "text-cyan-400"}`}
								>
									<Fuel size={18} />
								</div>
								<div>
									<h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
										Calculadora Flex (Etanol vs Gasolina)
									</h2>
									<p className="text-[11px] text-zinc-400">
										Descubra qual combustível compensa mais no posto
									</p>
								</div>
							</div>

							<button
								type="button"
								onClick={onClose}
								className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
							>
								<X size={16} />
							</button>
						</div>

						{/* Conteúdo rolável */}
						<div className="space-y-3.5 overflow-y-auto pr-1 py-2 flex-1 scrollbar-thin scrollbar-thumb-white/10">
							{/* Veredito Visual em Destaque */}
							{result && (
								<div
									className={`
										p-4
										rounded-2xl
										border
										transition-all
										flex
										items-center
										justify-between
										${
											result.winner === "etanol"
												? "bg-emerald-500/15 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
												: "bg-amber-500/15 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
										}
									`}
								>
									<div className="space-y-0.5">
										<span className="text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-300">
											Recomendação no Posto:
										</span>
										<h3
											className={`text-xl sm:text-2xl font-black ${
												result.winner === "etanol" ? "text-emerald-300" : "text-amber-300"
											}`}
										>
											Abasteça com {result.winner === "etanol" ? "ETANOL 🌿" : "GASOLINA ⛽"}
										</h3>
										<p className="text-[11px] text-zinc-300">
											Relação de preço:{" "}
											<strong className="text-white font-mono">{result.ratioPercent}%</strong>{" "}
											(limite: {result.thresholdPercent}%)
										</p>
									</div>

									{result.savings500km > 0 && (
										<div className="text-right">
											<span className="text-[10px] text-zinc-400 block">Economia a cada 500km</span>
											<span className="text-sm font-extrabold text-emerald-400 font-mono">
												~ R$ {formatNumberPtBR(result.savings500km.toFixed(2))}
											</span>
										</div>
									)}
								</div>
							)}

							{/* Inputs dos Preços */}
							<div className="grid grid-cols-2 gap-2">
								{/* Etanol */}
								<div className="p-3 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-1">
									<span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
										🌿 Etanol (R$)
									</span>
									<div className="flex items-center gap-1">
										<span className="text-xs text-zinc-500">R$</span>
										<input
											type="text"
											inputMode="numeric"
											value={ethanolPrice}
											onChange={(e) => setEthanolPrice(formatCurrencyInput(e.target.value))}
											placeholder="0,00"
											className="w-full bg-transparent text-lg font-bold text-white outline-none tabular-nums"
										/>
									</div>
								</div>

								{/* Gasolina */}
								<div className="p-3 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-1">
									<span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
										⛽ Gasolina (R$)
									</span>
									<div className="flex items-center gap-1">
										<span className="text-xs text-zinc-500">R$</span>
										<input
											type="text"
											inputMode="numeric"
											value={gasolinePrice}
											onChange={(e) => setGasolinePrice(formatCurrencyInput(e.target.value))}
											placeholder="0,00"
											className="w-full bg-transparent text-lg font-bold text-white outline-none tabular-nums"
										/>
									</div>
								</div>
							</div>

							{/* Alternador de Consumo Personalizado */}
							<div className="p-3 rounded-2xl bg-white/3 border border-white/8 space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
										<Gauge size={13} className="text-cyan-400" />
										Consumo real do seu veículo
									</span>
									<button
										type="button"
										onClick={() => {
											onPlayClick?.();
											setIsCustomConsumption((prev) => !prev);
										}}
										className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
											isCustomConsumption
												? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
												: "bg-white/5 text-zinc-400 hover:text-white"
										}`}
									>
										{isCustomConsumption ? "Personalizado (km/l)" : "Regra Padrão (70%)"}
									</button>
								</div>

								{isCustomConsumption && (
									<div className="grid grid-cols-2 gap-2 pt-1">
										<div>
											<span className="text-[10px] text-zinc-400 block mb-0.5">Etanol (km/l):</span>
											<input
												type="text"
												inputMode="decimal"
												value={ethanolKmL}
												onChange={(e) => setEthanolKmL(e.target.value.replace(/[^0-9.,]/g, ""))}
												placeholder="Ex: 8.5"
												className="w-full bg-zinc-800/80 px-2 py-1 rounded-xl text-xs text-white border border-white/10 outline-none focus:border-cyan-400"
											/>
										</div>
										<div>
											<span className="text-[10px] text-zinc-400 block mb-0.5">
												Gasolina (km/l):
											</span>
											<input
												type="text"
												inputMode="decimal"
												value={gasolineKmL}
												onChange={(e) => setGasolineKmL(e.target.value.replace(/[^0-9.,]/g, ""))}
												placeholder="Ex: 12.0"
												className="w-full bg-zinc-800/80 px-2 py-1 rounded-xl text-xs text-white border border-white/10 outline-none focus:border-cyan-400"
											/>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Footer com Ações */}
						<div className="pt-3 border-t border-white/8 grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={onClose}
								className="
									py-2.5
									px-4
									rounded-2xl
									bg-white/4
									hover:bg-white/8
									border
									border-white/10
									text-zinc-200
									hover:text-white
									text-xs
									font-semibold
									flex
									items-center
									justify-center
									transition-all
									cursor-pointer
									active:scale-95
								"
							>
								Fechar
							</button>

							<button
								type="button"
								onClick={handleTransfer}
								className="
									py-2.5
									px-4
									rounded-2xl
									bg-cyan-500/20
									hover:bg-cyan-500/30
									border
									border-cyan-500/40
									text-cyan-300
									text-xs
									font-semibold
									flex
									items-center
									justify-center
									gap-1.5
									transition-all
									cursor-pointer
									active:scale-95
									shadow-[0_0_15px_rgba(6,182,212,0.2)]
								"
							>
								<ArrowRight size={14} />
								<span>Usar Preço</span>
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});
