import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	Check,
	Coins,
	Minus,
	Plus,
	Receipt,
	Share2,
	Users,
	Utensils,
	X,
} from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ThemeConfig } from "../hooks/useThemes";
import { formatNumberPtBR } from "../utils/format";

type Props = {
	isOpen: boolean;
	initialAmount?: string;
	onClose: () => void;
	onTransferToCalculator: (value: string) => void;
	theme?: ThemeConfig;
	onPlayClick?: () => void;
	onPlayConfirm?: () => void;
};

const TIP_PRESETS = [0, 10, 12, 15, 20];
const PEOPLE_PRESETS = [2, 3, 4, 5, 6, 8, 10];

export const SplitBillModal = memo(function SplitBillModal({
	isOpen,
	initialAmount = "",
	onClose,
	onTransferToCalculator,
	theme,
	onPlayClick,
	onPlayConfirm,
}: Props) {
	const [billAmount, setBillAmount] = useState(initialAmount || "");
	const [peopleCount, setPeopleCount] = useState(2);
	const [tipPercentage, setTipPercentage] = useState(10);
	const [copied, setCopied] = useState(false);

	// Atualiza valor inicial ao abrir
	useEffect(() => {
		if (isOpen) {
			const clean =
				initialAmount && initialAmount !== "0" && initialAmount !== "Error"
					? initialAmount.replace(".", ",")
					: "";
			setBillAmount(clean);
			setCopied(false);
		}
	}, [isOpen, initialAmount]);

	// Fechar modal com Escape
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

	// Cálculos
	const calculation = useMemo(() => {
		const rawNum = Number(billAmount.replace(",", ".")) || 0;
		const tipAmount = rawNum * (tipPercentage / 100);
		const totalAmount = rawNum + tipAmount;
		const perPerson = peopleCount > 0 ? totalAmount / peopleCount : 0;

		return {
			subtotal: rawNum,
			tipAmount: Math.round(tipAmount * 100) / 100,
			totalAmount: Math.round(totalAmount * 100) / 100,
			perPerson: Math.round(perPerson * 100) / 100,
		};
	}, [billAmount, peopleCount, tipPercentage]);

	const handleCopyForWhatsApp = () => {
		onPlayConfirm?.();
		const msg = `🧾 *Divisão da Conta*
💰 *Subtotal:* R$ ${formatNumberPtBR(String(calculation.subtotal))}
✨ *Taxa de Serviço (${tipPercentage}%):* R$ ${formatNumberPtBR(String(calculation.tipAmount))}
💵 *Total Geral:* R$ ${formatNumberPtBR(String(calculation.totalAmount))}
👥 *Pessoas:* ${peopleCount}
━━━━━━━━━━━━━━━━━━
👉 *Valor por Pessoa:* R$ ${formatNumberPtBR(String(calculation.perPerson))}
━━━━━━━━━━━━━━━━━━
_Calculado via SmartCalc_`;

		navigator.clipboard.writeText(msg);
		setCopied(true);
		toast.success("Divisão copiada! Pronto para colar no WhatsApp.", {
			description: `R$ ${formatNumberPtBR(String(calculation.perPerson))} por pessoa (${peopleCount} pessoas)`,
		});
		setTimeout(() => setCopied(false), 2000);
	};

	const handleTransfer = () => {
		onPlayConfirm?.();
		onTransferToCalculator(String(calculation.perPerson));
		toast.success(
			`R$ ${formatNumberPtBR(String(calculation.perPerson))} transferido para a calculadora!`,
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
									<Utensils size={18} />
								</div>
								<div>
									<h2 className="text-base font-semibold text-white tracking-tight">
										Rachar a Conta
									</h2>
									<p className="text-[11px] text-zinc-400">Divisão de conta com gorjeta</p>
								</div>
							</div>

							<button
								type="button"
								onClick={onClose}
								aria-label="Fechar divisão de conta"
								className="p-1.5 rounded-2xl bg-white/4 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/6 active:scale-95 transition-all outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer"
							>
								<X size={18} />
							</button>
						</div>

						{/* Form Content */}
						<div className="space-y-3.5 py-3.5">
							{/* Campo 1: Valor Total da Conta */}
							<div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/8 space-y-1.5">
								<span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
									<Receipt size={13} /> Valor da Conta (R$)
								</span>
								<div className="flex items-center gap-2">
									<span className="text-xl text-zinc-500 font-light">R$</span>
									<input
										type="text"
										inputMode="decimal"
										value={billAmount}
										onChange={(e) => setBillAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
										placeholder="0,00"
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
							</div>

							{/* Campo 2: Quantidade de Pessoas */}
							<div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/8 space-y-2">
								<div className="flex items-center justify-between text-xs text-zinc-400">
									<span className="font-medium flex items-center gap-1.5">
										<Users size={13} /> Dividir entre
									</span>
									<span className="text-xs font-semibold text-white font-mono">
										{peopleCount} {peopleCount === 1 ? "pessoa" : "pessoas"}
									</span>
								</div>

								{/* Stepper + Quick Presets */}
								<div className="flex items-center gap-2">
									<div className="flex items-center rounded-xl bg-zinc-800 border border-white/10 p-0.5">
										<button
											type="button"
											onClick={() => {
												onPlayClick?.();
												setPeopleCount((p) => Math.max(1, p - 1));
											}}
											className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
										>
											<Minus size={14} />
										</button>
										<span className="w-8 text-center text-sm font-semibold text-white">
											{peopleCount}
										</span>
										<button
											type="button"
											onClick={() => {
												onPlayClick?.();
												setPeopleCount((p) => Math.min(99, p + 1));
											}}
											className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
										>
											<Plus size={14} />
										</button>
									</div>

									{/* Presets rápidos */}
									<div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-none">
										{PEOPLE_PRESETS.map((num) => (
											<button
												key={num}
												type="button"
												onClick={() => {
													onPlayClick?.();
													setPeopleCount(num);
												}}
												className={`
													px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 cursor-pointer shrink-0
													${
														peopleCount === num
															? `${theme?.accentText ?? "text-cyan-300"} bg-white/15 border border-white/20 font-semibold shadow-sm`
															: "text-zinc-400 bg-white/4 border border-white/6 hover:text-white hover:bg-white/8"
													}
												`}
											>
												{num}p
											</button>
										))}
									</div>
								</div>
							</div>

							{/* Campo 3: Taxa de Serviço / Gorjeta */}
							<div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/8 space-y-2">
								<div className="flex items-center justify-between text-xs text-zinc-400">
									<span className="font-medium flex items-center gap-1.5">
										<Coins size={13} /> Taxa de Serviço / Gorjeta
									</span>
									<span className="text-xs font-mono text-zinc-300">
										+ R$ {formatNumberPtBR(String(calculation.tipAmount))} ({tipPercentage}%)
									</span>
								</div>

								<div className="grid grid-cols-5 gap-1.5">
									{TIP_PRESETS.map((pct) => (
										<button
											key={pct}
											type="button"
											onClick={() => {
												onPlayClick?.();
												setTipPercentage(pct);
											}}
											className={`
												py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 cursor-pointer text-center
												${
													tipPercentage === pct
														? `${theme?.accentText ?? "text-cyan-300"} bg-white/15 border border-white/20 font-semibold shadow-sm`
														: "text-zinc-400 bg-white/4 border border-white/6 hover:text-white hover:bg-white/8"
												}
											`}
										>
											{pct}%
										</button>
									))}
								</div>
							</div>

							{/* Card de Resultado (Por Pessoa) */}
							<div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
								<div className="flex items-center justify-between text-xs text-emerald-300">
									<span>Valor por Pessoa</span>
									<span className="font-mono text-[11px] text-zinc-400">
										Total: R$ {formatNumberPtBR(String(calculation.totalAmount))}
									</span>
								</div>
								<div className="text-3xl font-normal text-emerald-400 tracking-tight tabular-nums">
									R$ {formatNumberPtBR(String(calculation.perPerson))}
								</div>
							</div>
						</div>

						{/* Footer Actions Padronizado */}
						<div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/8">
							{/* Botão Copiar WhatsApp */}
							<button
								type="button"
								onClick={handleCopyForWhatsApp}
								className="
									w-full
									py-3
									rounded-2xl
									bg-white/6
									hover:bg-white/10
									text-zinc-200
									hover:text-white
									text-xs
									font-medium
									border
									border-white/8
									flex
									items-center
									justify-center
									gap-1.5
									transition-all
									active:scale-95
									outline-none
									cursor-pointer
								"
							>
								{copied ? (
									<span className="text-emerald-400 flex items-center gap-1 font-semibold">
										<Check size={14} /> Copiado!
									</span>
								) : (
									<span className="flex items-center gap-1.5">
										<Share2 size={13} className="text-emerald-400" /> Copiar p/ WhatsApp
									</span>
								)}
							</button>

							{/* Botão Usar na Calculadora */}
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
