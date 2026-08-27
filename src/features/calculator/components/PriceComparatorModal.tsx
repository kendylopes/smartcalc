import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCcw, Scale, Sparkles, Trophy, X } from "lucide-react";
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

type UnitType = "g" | "kg" | "ml" | "l" | "un";

const UNIT_OPTIONS: { id: UnitType; label: string; baseMultiplier: number }[] = [
	{ id: "g", label: "g", baseMultiplier: 1 },
	{ id: "kg", label: "kg", baseMultiplier: 1000 },
	{ id: "ml", label: "ml", baseMultiplier: 1 },
	{ id: "l", label: "L", baseMultiplier: 1000 },
	{ id: "un", label: "un", baseMultiplier: 1 },
];

export const PriceComparatorModal = memo(function PriceComparatorModal({
	isOpen,
	onClose,
	onTransferToCalculator,
	theme,
	onPlayClick,
	onPlayConfirm,
}: Props) {
	// Produto A
	const [priceA, setPriceA] = useState("");
	const [qtyA, setQtyA] = useState("");
	const [unitA, setUnitA] = useState<UnitType>("g");

	// Produto B
	const [priceB, setPriceB] = useState("");
	const [qtyB, setQtyB] = useState("");
	const [unitB, setUnitB] = useState<UnitType>("g");

	// Limpar todos os campos
	const handleClear = () => {
		onPlayClick?.();
		setPriceA("");
		setQtyA("");
		setPriceB("");
		setQtyB("");
	};

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

	// Sincroniza a unidade de B quando A for alterada (se B não foi mexido)
	const handleUnitAChange = (newUnit: UnitType) => {
		setUnitA(newUnit);
		// Se a unidade de B for incompatível, ajusta automaticamente
		if ((newUnit === "g" || newUnit === "kg") && unitB !== "g" && unitB !== "kg") {
			setUnitB("g");
		} else if ((newUnit === "ml" || newUnit === "l") && unitB !== "ml" && unitB !== "l") {
			setUnitB("ml");
		} else if (newUnit === "un") {
			setUnitB("un");
		}
	};

	// Cálculos de comparação
	const comparison = useMemo(() => {
		const pA = parseCurrencyToNumber(priceA);
		const qA = Number(qtyA.replace(",", ".")) || 0;
		const multA = UNIT_OPTIONS.find((u) => u.id === unitA)?.baseMultiplier || 1;
		const totalBaseA = qA * multA;

		const pB = parseCurrencyToNumber(priceB);
		const qB = Number(qtyB.replace(",", ".")) || 0;
		const multB = UNIT_OPTIONS.find((u) => u.id === unitB)?.baseMultiplier || 1;
		const totalBaseB = qB * multB;

		if (pA <= 0 || totalBaseA <= 0 || pB <= 0 || totalBaseB <= 0) {
			return null;
		}

		// Preço por unidade base (por grama, por ml ou por unidade)
		const costPerBaseA = pA / totalBaseA;
		const costPerBaseB = pB / totalBaseB;

		// Preço por 1000 unidades base (por 1kg, 1L ou 1un)
		const multiplierForDisplay = unitA === "un" ? 1 : 1000;
		const displayPriceA = costPerBaseA * multiplierForDisplay;
		const displayPriceB = costPerBaseB * multiplierForDisplay;

		const displayUnit =
			unitA === "g" || unitA === "kg" ? "kg" : unitA === "ml" || unitA === "l" ? "L" : "un";

		let winner: "A" | "B" | "equal" = "equal";
		let savingsPercent = 0;

		if (costPerBaseA < costPerBaseB) {
			winner = "A";
			savingsPercent = ((costPerBaseB - costPerBaseA) / costPerBaseB) * 100;
		} else if (costPerBaseB < costPerBaseA) {
			winner = "B";
			savingsPercent = ((costPerBaseA - costPerBaseB) / costPerBaseA) * 100;
		}

		return {
			displayPriceA,
			displayPriceB,
			displayUnit,
			winner,
			savingsPercent: Math.round(savingsPercent * 10) / 10,
			winningPrice: winner === "A" ? pA : pB,
		};
	}, [priceA, qtyA, unitA, priceB, qtyB, unitB]);

	const handleTransferWinner = () => {
		if (!comparison) return;
		onPlayConfirm?.();
		onTransferToCalculator(String(comparison.winningPrice));
		toast.success(
			`Preço vencedor R$ ${formatNumberPtBR(String(comparison.winningPrice))} transferido!`,
			{
				description: `Opção ${comparison.winner} (${comparison.savingsPercent}% mais econômica)`,
			},
		);
		onClose();
	};

	const hasAnyData = priceA !== "" || qtyA !== "" || priceB !== "" || qtyB !== "";

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
									<Scale size={18} />
								</div>
								<div>
									<h2 className="text-base font-semibold text-white tracking-tight">
										Comparador de Embalagens
									</h2>
									<p className="text-[11px] text-zinc-400">Qual compensa mais por kg ou litro</p>
								</div>
							</div>

							<div className="flex items-center gap-1.5">
								{/* Botão Limpar Dados */}
								{hasAnyData && (
									<button
										type="button"
										onClick={handleClear}
										title="Limpar todos os campos"
										className="p-1.5 rounded-2xl bg-white/4 hover:bg-white/10 text-zinc-400 hover:text-red-400 border border-white/6 active:scale-95 transition-all outline-none cursor-pointer flex items-center gap-1 text-[11px]"
									>
										<RotateCcw size={14} />
										<span className="hidden sm:inline">Limpar</span>
									</button>
								)}

								<button
									type="button"
									onClick={onClose}
									aria-label="Fechar comparador"
									className="p-1.5 rounded-2xl bg-white/4 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/6 active:scale-95 transition-all outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer"
								>
									<X size={18} />
								</button>
							</div>
						</div>

						{/* Content */}
						<div className="space-y-3 py-3">
							{/* PRODUTO A */}
							<div
								className={`
									p-3.5
									rounded-2xl
									border
									transition-all
									${
										comparison?.winner === "A"
											? "bg-emerald-500/10 border-emerald-500/30"
											: "bg-zinc-900/60 border-white/8"
									}
								`}
							>
								<div className="flex items-center justify-between text-xs mb-2">
									<span className="font-semibold text-white flex items-center gap-1">
										{comparison?.winner === "A" && (
											<Trophy size={13} className="text-emerald-400" />
										)}
										<span>Opção A (Ex: Embalagem Menor)</span>
									</span>
									{comparison ? (
										<span className="font-mono text-[11px] text-zinc-300">
											R$ {formatNumberPtBR(comparison.displayPriceA.toFixed(2))} /{" "}
											{comparison.displayUnit}
										</span>
									) : (
										<span className="text-[10px] text-zinc-500">digite preço e peso</span>
									)}
								</div>

								<div className="grid grid-cols-2 gap-2">
									{/* Preço A */}
									<div className="flex items-center gap-1 bg-zinc-800/80 rounded-xl px-2.5 py-1.5 border border-white/10">
										<span className="text-xs text-zinc-500">R$</span>
										<input
											type="text"
											inputMode="numeric"
											value={priceA}
											onChange={(e) => setPriceA(formatCurrencyInput(e.target.value))}
											placeholder="0,00"
											className="w-full bg-transparent text-sm font-semibold text-white outline-none tabular-nums"
										/>
									</div>

									{/* Quantidade + Unidade A */}
									<div className="flex items-center gap-1 bg-zinc-800/80 rounded-xl px-2 py-1 border border-white/10">
										<input
											type="text"
											inputMode="decimal"
											value={qtyA}
											onChange={(e) => setQtyA(e.target.value.replace(/[^0-9.,]/g, ""))}
											placeholder="Ex: 250"
											className="w-full bg-transparent text-sm font-semibold text-white outline-none tabular-nums text-right"
										/>
										<select
											value={unitA}
											onChange={(e) => handleUnitAChange(e.target.value as UnitType)}
											className="bg-transparent text-xs text-cyan-300 font-medium outline-none cursor-pointer"
										>
											{UNIT_OPTIONS.map((u) => (
												<option key={u.id} value={u.id} className="bg-zinc-900 text-white">
													{u.label}
												</option>
											))}
										</select>
									</div>
								</div>
							</div>

							{/* PRODUTO B */}
							<div
								className={`
									p-3.5
									rounded-2xl
									border
									transition-all
									${
										comparison?.winner === "B"
											? "bg-emerald-500/10 border-emerald-500/30"
											: "bg-zinc-900/60 border-white/8"
									}
								`}
							>
								<div className="flex items-center justify-between text-xs mb-2">
									<span className="font-semibold text-white flex items-center gap-1">
										{comparison?.winner === "B" && (
											<Trophy size={13} className="text-emerald-400" />
										)}
										<span>Opção B (Ex: Embalagem Maior)</span>
									</span>
									{comparison ? (
										<span className="font-mono text-[11px] text-zinc-300">
											R$ {formatNumberPtBR(comparison.displayPriceB.toFixed(2))} /{" "}
											{comparison.displayUnit}
										</span>
									) : (
										<span className="text-[10px] text-zinc-500">digite preço e peso</span>
									)}
								</div>

								<div className="grid grid-cols-2 gap-2">
									{/* Preço B */}
									<div className="flex items-center gap-1 bg-zinc-800/80 rounded-xl px-2.5 py-1.5 border border-white/10">
										<span className="text-xs text-zinc-500">R$</span>
										<input
											type="text"
											inputMode="numeric"
											value={priceB}
											onChange={(e) => setPriceB(formatCurrencyInput(e.target.value))}
											placeholder="0,00"
											className="w-full bg-transparent text-sm font-semibold text-white outline-none tabular-nums"
										/>
									</div>

									{/* Quantidade + Unidade B */}
									<div className="flex items-center gap-1 bg-zinc-800/80 rounded-xl px-2 py-1 border border-white/10">
										<input
											type="text"
											inputMode="decimal"
											value={qtyB}
											onChange={(e) => setQtyB(e.target.value.replace(/[^0-9.,]/g, ""))}
											placeholder="Ex: 500"
											className="w-full bg-transparent text-sm font-semibold text-white outline-none tabular-nums text-right"
										/>
										<select
											value={unitB}
											onChange={(e) => setUnitB(e.target.value as UnitType)}
											className="bg-transparent text-xs text-cyan-300 font-medium outline-none cursor-pointer"
										>
											{UNIT_OPTIONS.map((u) => (
												<option key={u.id} value={u.id} className="bg-zinc-900 text-white">
													{u.label}
												</option>
											))}
										</select>
									</div>
								</div>
							</div>

							{/* CARD DE VEREDITO INTELIGENTE */}
							{comparison && (
								<motion.div
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1"
								>
									<div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
										<Sparkles size={14} className="text-emerald-400" />
										<span>Veredito de Economia</span>
									</div>

									{comparison.winner === "equal" ? (
										<p className="text-xs text-zinc-300">
											As duas embalagens têm exatamente o mesmo custo por {comparison.displayUnit}!
										</p>
									) : (
										<div className="space-y-0.5">
											<p className="text-base font-medium text-emerald-400">
												🏆 Opção {comparison.winner} é {comparison.savingsPercent}% mais econômica!
											</p>
											<p className="text-[11px] text-zinc-400">
												Você economiza escolhendo a Opção {comparison.winner} em relação à Opção{" "}
												{comparison.winner === "A" ? "B" : "A"}.
											</p>
										</div>
									)}
								</motion.div>
							)}
						</div>

						{/* Footer Actions */}
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
								onClick={handleTransferWinner}
								disabled={!comparison}
								className={`
									w-full
									py-3
									rounded-2xl
									flex
									items-center
									justify-center
									gap-1.5
									${theme?.equalBg ?? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]"}
									disabled:opacity-40
									text-xs
									font-semibold
									transition-all
									active:scale-95
									outline-none
									cursor-pointer
								`}
							>
								<ArrowRight size={14} />
								<span>Usar Vencedor</span>
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});
