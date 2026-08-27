import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Tag, TrendingUp, X } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ThemeConfig } from "../hooks/useThemes";
import { formatCurrencyInput, formatNumberPtBR, parseCurrencyToNumber } from "../utils/format";

type Props = {
	isOpen: boolean;
	initialAmount?: string;
	onClose: () => void;
	onTransferToCalculator: (value: string) => void;
	theme?: ThemeConfig;
	onPlayClick?: () => void;
	onPlayConfirm?: () => void;
};

export const DiscountProfitModal = memo(function DiscountProfitModal({
	isOpen,
	initialAmount = "",
	onClose,
	onTransferToCalculator,
	theme,
	onPlayClick,
	onPlayConfirm,
}: Props) {
	const [activeTab, setActiveTab] = useState<"discount" | "margin">("discount");

	// Aba 1: Desconto
	const [originalPrice, setOriginalPrice] = useState(initialAmount || "150,00");
	const [discountPercent, setDiscountPercent] = useState("15");

	// Aba 2: Margem & Lucro
	const [costPrice, setCostPrice] = useState(initialAmount || "50,00");
	const [targetMarginPercent, setTargetMarginPercent] = useState("40");

	useEffect(() => {
		if (isOpen && initialAmount) {
			const clean = initialAmount.replace(".", ",");
			setOriginalPrice(clean);
			setCostPrice(clean);
		}
	}, [isOpen, initialAmount]);

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	// Cálculos de Desconto
	const discountCalc = useMemo(() => {
		const orig = parseCurrencyToNumber(originalPrice);
		const disc = Number(discountPercent.replace(",", ".")) || 0;

		const savings = (orig * disc) / 100;
		const finalPrice = Math.max(0, orig - savings);

		return {
			orig,
			disc,
			savings: Math.round(savings * 100) / 100,
			finalPrice: Math.round(finalPrice * 100) / 100,
		};
	}, [originalPrice, discountPercent]);

	// Cálculos de Margem / Markup
	const marginCalc = useMemo(() => {
		const cost = parseCurrencyToNumber(costPrice);
		const marginPct = Number(targetMarginPercent.replace(",", ".")) || 0;

		// Preço de venda com margem sobre a venda: Venda = Custo / (1 - Margem/100)
		const marginDecimal = marginPct / 100;
		let sellPrice = 0;
		if (marginDecimal < 1) {
			sellPrice = cost / (1 - marginDecimal);
		} else {
			sellPrice = cost * (1 + marginDecimal);
		}

		const grossProfit = sellPrice - cost;
		const markupPct = cost > 0 ? (grossProfit / cost) * 100 : 0;

		return {
			cost,
			marginPct,
			sellPrice: Math.round(sellPrice * 100) / 100,
			grossProfit: Math.round(grossProfit * 100) / 100,
			markupPct: Math.round(markupPct * 10) / 10,
		};
	}, [costPrice, targetMarginPercent]);

	const handleTransfer = () => {
		onPlayConfirm?.();
		const val =
			activeTab === "discount" ? String(discountCalc.finalPrice) : String(marginCalc.sellPrice);
		onTransferToCalculator(val);
		toast.success(
			activeTab === "discount"
				? `Valor final de R$ ${formatNumberPtBR(val)} transferido para a calculadora!`
				: `Preço de venda de R$ ${formatNumberPtBR(val)} transferido para a calculadora!`,
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
									{activeTab === "discount" ? <Tag size={18} /> : <TrendingUp size={18} />}
								</div>
								<div>
									<h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
										{activeTab === "discount"
											? "Calculadora de Descontos"
											: "Margem de Lucro & Markup"}
									</h2>
									<p className="text-[11px] text-zinc-400">
										{activeTab === "discount"
											? "Calcule preços com % OFF e total economizado"
											: "Defina seu preço de venda e margem comercial"}
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

						{/* Abas Alternadoras */}
						<div className="grid grid-cols-2 gap-1 p-1 bg-zinc-950/80 rounded-2xl border border-white/8 my-3">
							<button
								type="button"
								onClick={() => {
									onPlayClick?.();
									setActiveTab("discount");
								}}
								className={`py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
									activeTab === "discount"
										? "bg-zinc-800 text-white shadow-sm border border-white/10"
										: "text-zinc-400 hover:text-zinc-200"
								}`}
							>
								<Tag size={13} />
								<span>Desconto (% OFF)</span>
							</button>

							<button
								type="button"
								onClick={() => {
									onPlayClick?.();
									setActiveTab("margin");
								}}
								className={`py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
									activeTab === "margin"
										? "bg-zinc-800 text-white shadow-sm border border-white/10"
										: "text-zinc-400 hover:text-zinc-200"
								}`}
							>
								<TrendingUp size={13} />
								<span>Margem & Lucro</span>
							</button>
						</div>

						{/* Conteúdo rolável */}
						<div className="space-y-3.5 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-white/10">
							{activeTab === "discount" ? (
								<>
									{/* Card Resultado do Desconto */}
									<div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
										<div>
											<span className="text-[10px] text-zinc-300 uppercase font-mono block">
												Preço Final com Desconto
											</span>
											<h3 className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
												R$ {formatNumberPtBR(discountCalc.finalPrice.toFixed(2))}
											</h3>
										</div>
										<div className="text-right">
											<span className="text-[10px] text-zinc-300 uppercase font-mono block">
												Você Economiza
											</span>
											<span className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">
												- R$ {formatNumberPtBR(discountCalc.savings.toFixed(2))}
											</span>
										</div>
									</div>

									{/* Inputs de Desconto */}
									<div className="space-y-2.5">
										<div className="p-3 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-1">
											<span className="text-[11px] font-semibold text-zinc-300">
												Preço Original (R$)
											</span>
											<div className="flex items-center gap-1">
												<span className="text-xs text-zinc-500">R$</span>
												<input
													type="text"
													inputMode="numeric"
													value={originalPrice}
													onChange={(e) => setOriginalPrice(formatCurrencyInput(e.target.value))}
													placeholder="0,00"
													className="w-full bg-transparent text-lg font-bold text-white outline-none tabular-nums"
												/>
											</div>
										</div>

										<div className="p-3 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-1.5">
											<div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
												<span>Desconto (%)</span>
												<div className="flex gap-1">
													{[5, 10, 15, 20, 30, 50].map((pct) => (
														<button
															key={pct}
															type="button"
															onClick={() => {
																onPlayClick?.();
																setDiscountPercent(String(pct));
															}}
															className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[10px] text-cyan-300 border border-white/6 cursor-pointer"
														>
															{pct}%
														</button>
													))}
												</div>
											</div>
											<div className="flex items-center gap-1">
												<input
													type="text"
													inputMode="decimal"
													value={discountPercent}
													onChange={(e) =>
														setDiscountPercent(e.target.value.replace(/[^0-9.,]/g, ""))
													}
													placeholder="15"
													className="w-full bg-transparent text-lg font-bold text-white outline-none tabular-nums"
												/>
												<span className="text-sm text-zinc-400 font-mono">%</span>
											</div>
										</div>
									</div>
								</>
							) : (
								<>
									{/* Card Resultado da Margem */}
									<div className="p-4 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-between">
										<div>
											<span className="text-[10px] text-zinc-300 uppercase font-mono block">
												Preço de Venda Sugerido
											</span>
											<h3 className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">
												R$ {formatNumberPtBR(marginCalc.sellPrice.toFixed(2))}
											</h3>
										</div>
										<div className="text-right">
											<span className="text-[10px] text-zinc-300 uppercase font-mono block">
												Lucro Bruto
											</span>
											<span className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">
												+ R$ {formatNumberPtBR(marginCalc.grossProfit.toFixed(2))}
											</span>
											<span className="text-[10px] text-zinc-400 block font-mono">
												(Markup: {marginCalc.markupPct}%)
											</span>
										</div>
									</div>

									{/* Inputs de Margem */}
									<div className="space-y-2.5">
										<div className="p-3 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-1">
											<span className="text-[11px] font-semibold text-zinc-300">
												Preço de Custo (R$)
											</span>
											<div className="flex items-center gap-1">
												<span className="text-xs text-zinc-500">R$</span>
												<input
													type="text"
													inputMode="numeric"
													value={costPrice}
													onChange={(e) => setCostPrice(formatCurrencyInput(e.target.value))}
													placeholder="0,00"
													className="w-full bg-transparent text-lg font-bold text-white outline-none tabular-nums"
												/>
											</div>
										</div>

										<div className="p-3 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-1.5">
											<div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
												<span>Margem Desejada sobre a Venda (%)</span>
												<div className="flex gap-1">
													{[20, 30, 40, 50].map((pct) => (
														<button
															key={pct}
															type="button"
															onClick={() => {
																onPlayClick?.();
																setTargetMarginPercent(String(pct));
															}}
															className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-[10px] text-cyan-300 border border-white/6 cursor-pointer"
														>
															{pct}%
														</button>
													))}
												</div>
											</div>
											<div className="flex items-center gap-1">
												<input
													type="text"
													inputMode="decimal"
													value={targetMarginPercent}
													onChange={(e) =>
														setTargetMarginPercent(e.target.value.replace(/[^0-9.,]/g, ""))
													}
													placeholder="40"
													className="w-full bg-transparent text-lg font-bold text-white outline-none tabular-nums"
												/>
												<span className="text-sm text-zinc-400 font-mono">%</span>
											</div>
										</div>
									</div>
								</>
							)}
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
								<span>Usar Valor</span>
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});
