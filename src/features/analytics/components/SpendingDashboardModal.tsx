import { AnimatePresence, motion } from "framer-motion";
import {
	BarChart3,
	Check,
	Copy,
	DollarSign,
	Package,
	PieChart,
	ShoppingBag,
	TrendingUp,
	X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import type { ThemeConfig } from "@/features/calculator/hooks/useThemes";
import type { HistoryItem } from "@/features/calculator/types/history";
import { useI18n } from "@/features/i18n";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	history: HistoryItem[];
	theme: ThemeConfig;
	onPlayClick?: () => void;
};

export const SpendingDashboardModal: React.FC<Props> = ({
	isOpen,
	onClose,
	history,
	theme,
	onPlayClick,
}) => {
	const { t, formatMoney } = useI18n();
	const [isCopied, setIsCopied] = useState(false);

	// Análise dos dados do histórico
	const stats = useMemo(() => {
		let total = 0;
		let highest = 0;
		let highestName = "";
		const itemsMap = new Map<string, { total: number; qty: number; count: number }>();

		const validRecords = history.filter((item) => {
			const resNum = Number(String(item.result).replace(",", "."));
			return !isNaN(resNum) && isFinite(resNum) && resNum > 0;
		});

		for (const rec of validRecords) {
			const val = Number(String(rec.result).replace(",", "."));
			total += val;

			if (val > highest) {
				highest = val;
				highestName = rec.productName || rec.expression || "Item";
			}

			const key = rec.productName?.trim() || (rec.tag ? `[${rec.tag}]` : "Cálculo Geral");
			const existing = itemsMap.get(key) || { total: 0, qty: 0, count: 0 };
			itemsMap.set(key, {
				total: existing.total + val,
				qty: existing.qty + (rec.quantity || 1),
				count: existing.count + 1,
			});
		}

		const average = validRecords.length > 0 ? total / validRecords.length : 0;

		// Top 5 maiores grupos de gastos
		const topItems = Array.from(itemsMap.entries())
			.map(([name, data]) => ({
				name,
				total: data.total,
				qty: data.qty,
				count: data.count,
				percent: total > 0 ? (data.total / total) * 100 : 0,
			}))
			.sort((a, b) => b.total - a.total)
			.slice(0, 5);

		return {
			total,
			count: validRecords.length,
			average,
			highest,
			highestName,
			topItems,
			hasData: validRecords.length > 0,
		};
	}, [history]);

	const handleCopySummary = () => {
		if (onPlayClick) onPlayClick();
		const lines = [
			`📊 *SmartCalc - Resumo de Gastos*`,
			`💰 *Total Gasto:* ${formatMoney(stats.total)}`,
			`📈 *Média por Operação:* ${formatMoney(stats.average)}`,
			`📦 *Total de Itens:* ${stats.count}`,
			stats.highest > 0 ? `⭐ *Maior Despesa:* ${stats.highestName} (${formatMoney(stats.highest)})` : "",
			"",
			`🏆 *Maiores Gastos:*`,
			...stats.topItems.map((item, idx) => `${idx + 1}. ${item.name}: ${formatMoney(item.total)} (${item.percent.toFixed(1)}%)`),
		].filter(Boolean);

		navigator.clipboard.writeText(lines.join("\n"));
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<div
				className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md"
				onClick={onClose}
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.94, y: 15 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.94, y: 15 }}
					transition={{ duration: 0.2, ease: "easeOut" }}
					onClick={(e) => e.stopPropagation()}
					className="
						relative
						w-full
						max-w-lg
						p-4
						sm:p-6
						rounded-[2.2rem]
						border
						border-white/14
						tech-modal
						shadow-[0_25px_60px_rgba(0,0,0,0.9)]
						flex
						flex-col
						max-h-[88vh]
						overflow-hidden
					"
				>
					{/* Header */}
					<div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/8 shrink-0">
						<div className="flex items-center gap-2.5">
							<div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
								<BarChart3 size={18} />
							</div>
							<div>
								<h3 className="text-sm sm:text-base font-semibold text-white tracking-wide">
									{t.analyticsTitle}
								</h3>
								<p className="text-[11px] text-zinc-400">{t.analyticsSubtitle}</p>
							</div>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
							title={t.close}
						>
							<X size={18} />
						</button>
					</div>

					{/* Conteúdo Rolável */}
					<div className="overflow-y-auto space-y-4 pr-1 pb-1 custom-scrollbar">
						{!stats.hasData ? (
							<div className="py-10 text-center flex flex-col items-center justify-center">
								<div className="p-4 rounded-full bg-white/4 border border-white/8 text-zinc-500 mb-3">
									<PieChart size={32} />
								</div>
								<h4 className="text-sm font-semibold text-zinc-300">{t.noAnalyticsData}</h4>
								<p className="text-xs text-zinc-500 max-w-xs mt-1">
									{t.noAnalyticsDataDesc}
								</p>
							</div>
						) : (
							<>
								{/* Grid de Métricas Principais (KPIs) */}
								<div className="grid grid-cols-2 gap-2.5 sm:gap-3">
									{/* Total Acumulado */}
									<div className="p-3.5 rounded-2xl bg-white/4 border border-white/8 relative overflow-hidden">
										<div className="flex items-center justify-between text-zinc-400 mb-1">
											<span className="text-[11px] font-medium">{t.totalSpent}</span>
											<DollarSign size={14} className={theme.accentText} />
										</div>
										<p className="text-base sm:text-lg font-bold text-white tracking-tight">
											{formatMoney(stats.total)}
										</p>
									</div>

									{/* Média por Compra */}
									<div className="p-3.5 rounded-2xl bg-white/4 border border-white/8 relative overflow-hidden">
										<div className="flex items-center justify-between text-zinc-400 mb-1">
											<span className="text-[11px] font-medium">{t.averageOperation}</span>
											<TrendingUp size={14} className="text-emerald-400" />
										</div>
										<p className="text-base sm:text-lg font-bold text-white tracking-tight">
											{formatMoney(stats.average)}
										</p>
									</div>

									{/* Itens / Registros */}
									<div className="p-3.5 rounded-2xl bg-white/4 border border-white/8 relative overflow-hidden">
										<div className="flex items-center justify-between text-zinc-400 mb-1">
											<span className="text-[11px] font-medium">{t.totalItems}</span>
											<Package size={14} className="text-indigo-400" />
										</div>
										<p className="text-base sm:text-lg font-bold text-white tracking-tight">
											{stats.count}
										</p>
									</div>

									{/* Maior Gasto Único */}
									<div className="p-3.5 rounded-2xl bg-white/4 border border-white/8 relative overflow-hidden">
										<div className="flex items-center justify-between text-zinc-400 mb-1">
											<span className="text-[11px] font-medium">{t.highestExpense}</span>
											<ShoppingBag size={14} className="text-amber-400" />
										</div>
										<p className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
											{formatMoney(stats.highest)}
										</p>
										{stats.highestName && (
											<span className="text-[10px] text-zinc-400 truncate block mt-0.5">
												{stats.highestName}
											</span>
										)}
									</div>
								</div>

								{/* Gráfico de Distribuição dos Maiores Itens */}
								{stats.topItems.length > 0 && (
									<div className="p-4 rounded-2xl bg-white/4 border border-white/8 space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
												<BarChart3 size={14} className="text-cyan-400" />
												{t.topItemsRanking}
											</span>
											<span className="text-[10px] text-zinc-500">% do Total</span>
										</div>

										<div className="space-y-2.5">
											{stats.topItems.map((item, index) => (
												<div key={index} className="space-y-1">
													<div className="flex items-center justify-between text-xs">
														<span className="text-zinc-300 font-medium truncate max-w-[60%]">
															{item.name}
															{item.qty > 1 && (
																<span className="text-zinc-500 ml-1 text-[10px]">
																	({item.qty} un)
																</span>
															)}
														</span>
														<span className="text-white font-semibold font-mono">
															{formatMoney(item.total)}{" "}
															<span className="text-[10px] font-normal text-zinc-400">
																({item.percent.toFixed(1)}%)
															</span>
														</span>
													</div>
													{/* Barra de Progresso Visual de Cristal */}
													<div className="h-2 w-full rounded-full bg-white/6 overflow-hidden border border-white/10">
														<motion.div
															initial={{ width: 0 }}
															animate={{ width: `${item.percent}%` }}
															transition={{ duration: 0.6, delay: index * 0.08 }}
															style={{ backgroundColor: theme.hex }}
															className="h-full rounded-full shadow-[0_0_8px_currentColor]"
														/>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Botão de Exportação / Compartilhamento */}
								<div className="pt-2">
									<button
										type="button"
										onClick={handleCopySummary}
										className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/12 text-white text-xs font-semibold transition-colors cursor-pointer"
									>
										{isCopied ? (
											<>
												<Check size={14} className="text-emerald-400" />
												<span className="text-emerald-400">Resumo Copiado para a Área de Transferência!</span>
											</>
										) : (
											<>
												<Copy size={14} />
												<span>{t.exportSummary}</span>
											</>
										)}
									</button>
								</div>
							</>
						)}
					</div>
				</motion.div>
			</div>
		</AnimatePresence>
	);
};
