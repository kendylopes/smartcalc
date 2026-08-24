import { memo, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	Calendar,
	CreditCard,
	DollarSign,
	Percent,
	PiggyBank,
	TrendingUp,
	X,
} from "lucide-react";
import { toast } from "sonner";
import type { ThemeConfig } from "@/features/calculator/hooks/useThemes";
import { formatNumberPtBR } from "@/features/calculator/utils/format";
import { calculateCompoundInterest, calculateInstallments } from "../logic/finance";

type Props = {
	isOpen: boolean;
	initialAmount?: string;
	onClose: () => void;
	onTransferToCalculator: (value: string) => void;
	theme?: ThemeConfig;
	onPlayClick?: () => void;
	onPlayConfirm?: () => void;
};

const INSTALLMENT_MONTHS_PRESETS = [3, 6, 10, 12, 18, 24, 36, 48];
const INVESTMENT_YEARS_PRESETS = [1, 2, 3, 5, 10, 15, 20];

export const FinanceModal = memo(function FinanceModal({
	isOpen,
	initialAmount = "",
	onClose,
	onTransferToCalculator,
	theme,
	onPlayClick,
	onPlayConfirm,
}: Props) {
	const [activeTab, setActiveTab] = useState<"installments" | "investments">("installments");

	// Estado: Parcelamento
	const [principal, setPrincipal] = useState(initialAmount || "");
	const [installmentsCount, setInstallmentsCount] = useState(12);
	const [monthlyInterestRate, setMonthlyInterestRate] = useState("1.99");

	// Estado: Investimentos
	const [initialDeposit, setInitialDeposit] = useState("1000");
	const [monthlyDeposit, setMonthlyDeposit] = useState("300");
	const [investmentRate, setInvestmentRate] = useState("1.0");
	const [investmentRateType, setInvestmentRateType] = useState<"monthly" | "yearly">("monthly");
	const [investmentPeriodMonths, setInvestmentPeriodMonths] = useState(24);

	useEffect(() => {
		if (isOpen) {
			const clean =
				initialAmount && initialAmount !== "0" && initialAmount !== "Error"
					? initialAmount.replace(".", ",")
					: "";
			if (clean) setPrincipal(clean);
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

	// Resultado: Parcelamento
	const installmentResult = useMemo(() => {
		const p = Number(principal.replace(",", ".")) || 0;
		const rate = Number(monthlyInterestRate.replace(",", ".")) || 0;
		return calculateInstallments(p, installmentsCount, rate);
	}, [principal, installmentsCount, monthlyInterestRate]);

	// Resultado: Investimentos
	const investmentResult = useMemo(() => {
		const init = Number(initialDeposit.replace(",", ".")) || 0;
		const monthly = Number(monthlyDeposit.replace(",", ".")) || 0;
		const rate = Number(investmentRate.replace(",", ".")) || 0;
		return calculateCompoundInterest(
			init,
			monthly,
			rate,
			investmentRateType,
			investmentPeriodMonths,
		);
	}, [
		initialDeposit,
		monthlyDeposit,
		investmentRate,
		investmentRateType,
		investmentPeriodMonths,
	]);

	const handleTransfer = () => {
		onPlayConfirm?.();
		const val =
			activeTab === "installments"
				? String(installmentResult.monthlyPayment)
				: String(investmentResult.finalBalance);
		onTransferToCalculator(val);
		toast.success(
			activeTab === "installments"
				? `Parcela de R$ ${formatNumberPtBR(val)} transferida para a calculadora!`
				: `Saldo de R$ ${formatNumberPtBR(val)} transferido para a calculadora!`,
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
									<TrendingUp size={18} />
								</div>
								<div>
									<h2 className="text-base font-semibold text-white tracking-tight">
										Simulador Financeiro
									</h2>
									<p className="text-[11px] text-zinc-400">Parcelas e juros compostos</p>
								</div>
							</div>

							<button
								type="button"
								onClick={onClose}
								aria-label="Fechar simulador financeiro"
								className="p-1.5 rounded-2xl bg-white/4 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/6 active:scale-95 transition-all outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer"
							>
								<X size={18} />
							</button>
						</div>

						{/* Tabs Switcher Padronizado */}
						<div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-white/8 my-3">
							<button
								type="button"
								onClick={() => {
									onPlayClick?.();
									setActiveTab("installments");
								}}
								className={`
									flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer
									${
										activeTab === "installments"
											? `${theme?.accentText ?? "text-cyan-300"} bg-white/10 border border-white/15 shadow-sm font-semibold`
											: "text-zinc-400 hover:text-white"
									}
								`}
							>
								<CreditCard size={13} />
								<span>Parcelamento</span>
							</button>

							<button
								type="button"
								onClick={() => {
									onPlayClick?.();
									setActiveTab("investments");
								}}
								className={`
									flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer
									${
										activeTab === "investments"
											? `${theme?.accentText ?? "text-cyan-300"} bg-white/10 border border-white/15 shadow-sm font-semibold`
											: "text-zinc-400 hover:text-white"
									}
								`}
							>
								<PiggyBank size={13} />
								<span>Investimentos</span>
							</button>
						</div>

						{/* TAB 1: PARCELAMENTO COM JUROS */}
						{activeTab === "installments" && (
							<div className="space-y-3 py-1">
								{/* Valor Total */}
								<div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/8 space-y-1.5">
									<span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
										<DollarSign size={13} /> Valor da Compra (R$)
									</span>
									<div className="flex items-center gap-2">
										<span className="text-xl text-zinc-500 font-light">R$</span>
										<input
											type="text"
											inputMode="decimal"
											value={principal}
											onChange={(e) => setPrincipal(e.target.value.replace(/[^0-9.,]/g, ""))}
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
												tabular-nums
											"
										/>
									</div>
								</div>

								{/* Taxa de Juros Mensal */}
								<div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/8 space-y-1.5">
									<span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
										<Percent size={13} /> Taxa de Juros (% ao mês)
									</span>
									<div className="flex items-center gap-2">
										<input
											type="text"
											inputMode="decimal"
											value={monthlyInterestRate}
											onChange={(e) =>
												setMonthlyInterestRate(e.target.value.replace(/[^0-9.,]/g, ""))
											}
											placeholder="1,99"
											className="
												w-full
												bg-transparent
												text-xl sm:text-2xl
												font-light
												text-white
												tracking-tight
												outline-none
												border-b
												border-white/15
												focus:border-cyan-400
												pb-0.5
												tabular-nums
											"
										/>
										<span className="text-xs text-zinc-400 font-mono shrink-0">% a.m.</span>
									</div>
								</div>

								{/* Número de Parcelas */}
								<div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/8 space-y-2">
									<div className="flex items-center justify-between text-xs text-zinc-400">
										<span className="font-medium flex items-center gap-1.5">
											<Calendar size={13} /> Quantidade de Parcelas
										</span>
										<span className="text-xs font-semibold text-white font-mono">
											{installmentsCount}x de R${" "}
											{formatNumberPtBR(String(installmentResult.monthlyPayment))}
										</span>
									</div>

									<div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
										{INSTALLMENT_MONTHS_PRESETS.map((m) => (
											<button
												key={m}
												type="button"
												onClick={() => {
													onPlayClick?.();
													setInstallmentsCount(m);
												}}
												className={`
													px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 cursor-pointer shrink-0
													${
														installmentsCount === m
															? `${theme?.accentText ?? "text-cyan-300"} bg-white/15 border border-white/20 font-semibold shadow-sm`
															: "text-zinc-400 bg-white/4 border border-white/6 hover:text-white hover:bg-white/8"
													}
												`}
											>
												{m}x
											</button>
										))}
									</div>
								</div>

								{/* Card de Resultado do Parcelamento */}
								<div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-xs text-emerald-300">Valor de Cada Parcela:</span>
										<span className="text-xl sm:text-2xl font-light text-emerald-400 tabular-nums">
											{installmentsCount}x de R${" "}
											{formatNumberPtBR(String(installmentResult.monthlyPayment))}
										</span>
									</div>
									<div className="flex items-center justify-between text-xs text-zinc-400 pt-1.5 border-t border-white/8">
										<span>Total Pago no Final:</span>
										<span className="text-zinc-200 font-mono">
											R$ {formatNumberPtBR(String(installmentResult.totalPayment))}
										</span>
									</div>
									<div className="flex items-center justify-between text-xs text-zinc-400">
										<span>Total de Juros:</span>
										<span className="text-amber-400 font-mono">
											+ R$ {formatNumberPtBR(String(installmentResult.totalInterest))}
										</span>
									</div>
								</div>
							</div>
						)}

						{/* TAB 2: INVESTIMENTOS (JUROS COMPOSTOS) */}
						{activeTab === "investments" && (
							<div className="space-y-3 py-1">
								{/* Depósito Inicial e Aporte Mensal */}
								<div className="grid grid-cols-2 gap-2">
									<div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/8 space-y-1">
										<span className="text-[11px] font-medium text-zinc-400">Valor Inicial (R$)</span>
										<input
											type="text"
											inputMode="decimal"
											value={initialDeposit}
											onChange={(e) =>
												setInitialDeposit(e.target.value.replace(/[^0-9.,]/g, ""))
											}
											placeholder="1000"
											className="w-full bg-transparent text-lg font-light text-white outline-none border-b border-white/15 focus:border-cyan-400 pb-0.5 tabular-nums"
										/>
									</div>

									<div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/8 space-y-1">
										<span className="text-[11px] font-medium text-zinc-400">Aporte Mensal (R$)</span>
										<input
											type="text"
											inputMode="decimal"
											value={monthlyDeposit}
											onChange={(e) =>
												setMonthlyDeposit(e.target.value.replace(/[^0-9.,]/g, ""))
											}
											placeholder="300"
											className="w-full bg-transparent text-lg font-light text-white outline-none border-b border-white/15 focus:border-cyan-400 pb-0.5 tabular-nums"
										/>
									</div>
								</div>

								{/* Taxa de Rentabilidade */}
								<div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/8 space-y-1.5">
									<div className="flex items-center justify-between text-xs text-zinc-400">
										<span className="font-medium">Rentabilidade Estimada</span>
										<div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-0.5 border border-white/10">
											<button
												type="button"
												onClick={() => setInvestmentRateType("monthly")}
												className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
													investmentRateType === "monthly"
														? "bg-white/20 text-white font-semibold"
														: "text-zinc-400"
												}`}
											>
												% a.m.
											</button>
											<button
												type="button"
												onClick={() => setInvestmentRateType("yearly")}
												className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
													investmentRateType === "yearly"
														? "bg-white/20 text-white font-semibold"
														: "text-zinc-400"
												}`}
											>
												% a.a.
											</button>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<input
											type="text"
											inputMode="decimal"
											value={investmentRate}
											onChange={(e) =>
												setInvestmentRate(e.target.value.replace(/[^0-9.,]/g, ""))
											}
											placeholder="1.0"
											className="w-full bg-transparent text-xl font-light text-white outline-none border-b border-white/15 focus:border-cyan-400 pb-0.5 tabular-nums"
										/>
									</div>
								</div>

								{/* Prazo (Anos Presets) */}
								<div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/8 space-y-2">
									<div className="flex items-center justify-between text-xs text-zinc-400">
										<span className="font-medium">Período de Investimento</span>
										<span className="text-xs font-semibold text-white font-mono">
											{investmentPeriodMonths / 12} anos ({investmentPeriodMonths} meses)
										</span>
									</div>

									<div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
										{INVESTMENT_YEARS_PRESETS.map((yrs) => (
											<button
												key={yrs}
												type="button"
												onClick={() => {
													onPlayClick?.();
													setInvestmentPeriodMonths(yrs * 12);
												}}
												className={`
													px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 cursor-pointer shrink-0
													${
														investmentPeriodMonths === yrs * 12
															? `${theme?.accentText ?? "text-cyan-300"} bg-white/15 border border-white/20 font-semibold shadow-sm`
															: "text-zinc-400 bg-white/4 border border-white/6 hover:text-white hover:bg-white/8"
													}
												`}
											>
												{yrs} {yrs === 1 ? "ano" : "anos"}
											</button>
										))}
									</div>
								</div>

								{/* Card de Resultado do Investimento */}
								<div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
									<div className="flex items-center justify-between text-xs text-emerald-300">
										<span>Patrimônio Acumulado:</span>
										<span className="text-xl sm:text-2xl font-light text-emerald-400 tabular-nums">
											R$ {formatNumberPtBR(String(investmentResult.finalBalance))}
										</span>
									</div>
									<div className="flex items-center justify-between text-xs text-zinc-400 pt-1.5 border-t border-white/8">
										<span>Total Guardado do Bolso:</span>
										<span className="text-zinc-300 font-mono">
											R$ {formatNumberPtBR(String(investmentResult.totalInvested))}
										</span>
									</div>
									<div className="flex items-center justify-between text-xs text-zinc-400">
										<span>Juros Compostos Ganhos:</span>
										<span className="text-emerald-400 font-mono font-semibold">
											+ R$ {formatNumberPtBR(String(investmentResult.totalInterestEarned))}
										</span>
									</div>
								</div>
							</div>
						)}

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
