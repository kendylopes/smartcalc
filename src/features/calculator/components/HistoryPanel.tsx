import { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
	Check,
	Clock,
	Copy,
	Download,
	FileSpreadsheet,
	FileText,
	ListOrdered,
	PieChart,
	Share2,
	ShoppingBag,
	Tag,
	Trash2,
	X,
} from "lucide-react";
import type { ThemeConfig } from "../hooks/useThemes";
import type { HistoryItem } from "../types";
import { formatDisplay, formatNumberPtBR } from "../utils/format";
import { BudgetBar } from "./BudgetBar";
import { ExpenseChart } from "./ExpenseChart";

type Props = {
	history: HistoryItem[];
	onSelect: (value: string) => void;
	onDelete: (id: string) => void;
	onUpdateTag?: (id: string, tag?: string) => void;
	onClearAll?: () => void;
	theme?: ThemeConfig;
};

const PRESET_TAGS = [
	{ label: "Mercado", icon: "🛒" },
	{ label: "Açougue", icon: "🥩" },
	{ label: "Padaria", icon: "🍞" },
	{ label: "Hortifrúti", icon: "🥦" },
	{ label: "Limpeza", icon: "🧼" },
	{ label: "Contas", icon: "💡" },
];

export const HistoryPanel = memo(function HistoryPanel({
	history,
	onSelect,
	onDelete,
	onUpdateTag,
	onClearAll,
	theme,
}: Props) {
	const [activeTab, setActiveTab] = useState<"list" | "chart">("list");
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [tagEditingId, setTagEditingId] = useState<string | null>(null);
	const [customTagInput, setCustomTagInput] = useState("");
	const [showExportMenu, setShowExportMenu] = useState(false);
	const exportRef = useRef<HTMLDivElement>(null);

	// Fechar menu de exportação ao clicar fora
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
				setShowExportMenu(false);
			}
		};

		if (showExportMenu) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [showExportMenu]);

	const handleCopy = (e: React.MouseEvent, item: HistoryItem) => {
		e.stopPropagation();
		navigator.clipboard.writeText(formatNumberPtBR(item.result));
		setCopiedId(item.id);
		setTimeout(() => setCopiedId(null), 1500);
	};

	// Exportar Cupom de Supermercado formatado para WhatsApp
	const handleExportWhatsAppMarket = () => {
		setShowExportMenu(false);
		if (history.length === 0) return;

		let totalSum = 0;
		const lines = history.map((item, idx) => {
			const numRes = Number(item.result) || 0;
			totalSum += numRes;

			if (item.productName) {
				const qtyInfo =
					item.quantity && item.unitPrice
						? ` (${item.quantity}x R$ ${formatNumberPtBR(String(item.unitPrice))})`
						: "";
				return `${idx + 1}. *${item.productName}*${qtyInfo} = R$ ${formatNumberPtBR(item.result)}`;
			}
			return `${idx + 1}. ${formatDisplay(item.expression)} = R$ ${formatNumberPtBR(item.result)}`;
		});

		const msg = `🛒 *Cupom de Compras — SmartCalc*
━━━━━━━━━━━━━━━━━━━━
${lines.join("\n")}
━━━━━━━━━━━━━━━━━━━━
💰 *Total Acumulado:* R$ ${formatNumberPtBR(totalSum.toFixed(2))} (${history.length} itens)
_Calculado via SmartCalc_`;

		navigator.clipboard.writeText(msg);
		alert("Cupom de compras copiado! Pronto para colar no WhatsApp.");
	};

	// Exportar como TXT
	const handleExportTXT = () => {
		setShowExportMenu(false);
		if (history.length === 0) return;
		const content = history
			.map((item, idx) => {
				const productPart = item.productName ? ` [${item.productName}]` : "";
				const tagPart = item.tag ? ` {${item.tag}}` : "";
				const datePart = item.timestamp
					? ` (${new Date(item.timestamp).toLocaleString("pt-BR")})`
					: "";
				return `${idx + 1}.${productPart}${tagPart} ${formatDisplay(item.expression)} = ${formatNumberPtBR(item.result)}${datePart}`;
			})
			.join("\n");

		const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `historico-calculadora-${new Date().toISOString().slice(0, 10)}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	};

	// Exportar como CSV para Excel / Google Planilhas
	const handleExportCSV = () => {
		setShowExportMenu(false);
		if (history.length === 0) return;

		// UTF-8 BOM (\uFEFF) para garantir acentuação correta no Excel brasileiro
		const headers = "Item;Data;Hora;Produto;Etiqueta;Qtd;PrecoUnit;Expressao;Resultado\n";
		const rows = history
			.map((item, idx) => {
				const dateObj = item.timestamp ? new Date(item.timestamp) : new Date();
				const dateStr = dateObj.toLocaleDateString("pt-BR");
				const timeStr = dateObj.toLocaleTimeString("pt-BR");
				const prod = (item.productName || "").replace(/;/g, ",");
				const tag = (item.tag || "").replace(/;/g, ",");
				const qty = item.quantity || 1;
				const unit = item.unitPrice ? formatNumberPtBR(String(item.unitPrice)) : "";
				const expr = formatDisplay(item.expression).replace(/;/g, ",");
				const res = formatNumberPtBR(item.result);
				return `${idx + 1};${dateStr};${timeStr};"${prod}";"${tag}";${qty};"${unit}";"${expr}";"${res}"`;
			})
			.join("\n");

		const blob = new Blob(["\uFEFF" + headers + rows], {
			type: "text/csv;charset=utf-8;",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `historico-smartcalc-${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleSaveTag = (id: string, tagValue?: string) => {
		onUpdateTag?.(id, tagValue);
		setTagEditingId(null);
		setCustomTagInput("");
	};

	return (
		<div className="h-full flex flex-col justify-between select-none overflow-hidden relative">
			{/* Header do Histórico */}
			<div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/8 shrink-0">
				<div className="flex items-center gap-1.5">
					<Clock size={14} className={theme?.accentText ?? "text-cyan-400"} />
					<span className="text-zinc-200 text-xs font-semibold tracking-wide">
						Histórico & Itens
					</span>
				</div>

				<div className="flex items-center gap-1.5">
					{history.length > 0 && (
						<>
							<span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-zinc-400 font-mono">
								{history.length}
							</span>

							{/* Dropdown de Exportação */}
							<div className="relative" ref={exportRef}>
								<button
									type="button"
									onClick={() => setShowExportMenu((prev) => !prev)}
									aria-label="Exportar histórico"
									title="Exportar histórico (.CSV, .TXT ou WhatsApp)"
									className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/8 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer"
								>
									<Download size={13} />
								</button>

								<AnimatePresence>
									{showExportMenu && (
										<motion.div
											initial={{ opacity: 0, scale: 0.95, y: -4 }}
											animate={{ opacity: 1, scale: 1, y: 0 }}
											exit={{ opacity: 0, scale: 0.95, y: -4 }}
											transition={{ duration: 0.12 }}
											className="absolute right-0 top-7 z-50 w-52 p-1.5 rounded-2xl bg-zinc-900 border border-white/15 tech-modal shadow-[0_16px_40px_rgba(0,0,0,0.9)] space-y-1"
										>
											<button
												type="button"
												onClick={handleExportWhatsAppMarket}
												className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-zinc-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left font-medium"
											>
												<Share2 size={13} className="text-emerald-400" />
												<span>Cupom WhatsApp</span>
											</button>
											<button
												type="button"
												onClick={handleExportCSV}
												className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-zinc-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
											>
												<FileSpreadsheet size={13} className="text-emerald-400" />
												<span>Planilha Excel (.csv)</span>
											</button>
											<button
												type="button"
												onClick={handleExportTXT}
												className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-zinc-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
											>
												<FileText size={13} className="text-cyan-400" />
												<span>Arquivo de Texto (.txt)</span>
											</button>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Limpar histórico */}
							{onClearAll && (
								<button
									type="button"
									onClick={onClearAll}
									aria-label="Limpar todo o histórico"
									title="Limpar histórico"
									className="p-1 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-red-400 cursor-pointer"
								>
									<Trash2 size={13} />
								</button>
							)}
						</>
					)}
				</div>
			</div>

			{/* Barra de Meta de Gastos / Limite de Orçamento */}
			<BudgetBar
				currentTotal={history.reduce((acc, item) => acc + (Number(item.result) || 0), 0)}
			/>

			{/* Alternador de Visualização (Extrato vs Gráfico) */}
			{history.length > 0 && (
				<div className="grid grid-cols-2 gap-1 p-1 bg-zinc-950/80 rounded-xl border border-white/6 my-2">
					<button
						type="button"
						onClick={() => setActiveTab("list")}
						className={`
							flex items-center justify-center gap-1.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer outline-none
							${
								activeTab === "list"
									? "bg-zinc-800 text-white shadow-sm font-semibold"
									: "text-zinc-400 hover:text-zinc-200 hover:bg-white/3"
							}
						`}
					>
						<ListOrdered size={12} />
						<span>Extrato</span>
					</button>

					<button
						type="button"
						onClick={() => setActiveTab("chart")}
						className={`
							flex items-center justify-center gap-1.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer outline-none
							${
								activeTab === "chart"
									? `${theme?.operatorBgActive ?? "bg-cyan-500/20"} ${theme?.accentText ?? "text-cyan-300"} shadow-sm font-semibold border ${theme?.operatorBorderActive ?? "border-cyan-500/30"}`
									: "text-zinc-400 hover:text-zinc-200 hover:bg-white/3"
							}
						`}
					>
						<PieChart size={12} />
						<span>Gráfico</span>
					</button>
				</div>
			)}

			{/* Empty State */}
			{history.length === 0 && (
				<div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
					<div className="w-10 h-10 rounded-2xl bg-white/3 border border-white/6 flex items-center justify-center text-zinc-600 mb-2">
						<Clock size={18} />
					</div>
					<p className="text-zinc-500 text-xs font-light">Nenhum cálculo ou produto registrado</p>
				</div>
			)}

			{/* Visualização: Gráfico de Categorias */}
			{history.length > 0 && activeTab === "chart" && (
				<ExpenseChart history={history} theme={theme} />
			)}

			{/* Visualização: Extrato / Lista de Itens */}
			{history.length > 0 && activeTab === "list" && (
				<div className="flex-1 overflow-y-auto max-h-115 pr-1 pb-1 space-y-2 scrollbar-none">
					<AnimatePresence mode="popLayout">
						{history.map((item) => (
							<motion.div
								layout
								key={item.id}
								initial={{ opacity: 0, y: 6, scale: 0.98 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
								className="group/item relative flex flex-col p-2.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-white/8 hover:border-white/15 transition-all duration-150 overflow-hidden"
							>
								{/* Top Row do Item: Nome do Produto / Etiqueta & Ações */}
								<div className="flex items-center justify-between gap-1 mb-1">
									{/* Nome do Produto ou Tag */}
									{item.productName ? (
										<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
											<ShoppingBag size={9} />
											<span className="truncate max-w-35">{item.productName}</span>
										</span>
									) : item.tag ? (
										<span
											onClick={(e) => {
												e.stopPropagation();
												setTagEditingId(item.id);
												setCustomTagInput(item.tag || "");
											}}
											title="Clique para editar etiqueta"
											className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 cursor-pointer hover:bg-cyan-500/20 transition-colors"
										>
											<Tag size={9} />
											<span>{item.tag}</span>
										</span>
									) : (
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												setTagEditingId(item.id);
												setCustomTagInput("");
											}}
											className="opacity-0 group-hover/item:opacity-60 hover:opacity-100! text-[10px] text-zinc-400 hover:text-cyan-300 flex items-center gap-1 transition-all cursor-pointer"
										>
											<Tag size={9} />
											<span>+ Tag</span>
										</button>
									)}

									{/* Ações Rápidas (Copiar / Excluir) */}
									<div className="shrink-0 flex items-center gap-1 opacity-60 group-hover/item:opacity-100 transition-opacity">
										<button
											type="button"
											onClick={(e) => handleCopy(e, item)}
											aria-label="Copiar resultado"
											title="Copiar resultado"
											className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors outline-none cursor-pointer"
										>
											{copiedId === item.id ? (
												<Check size={12} className="text-emerald-400" />
											) : (
												<Copy size={12} />
											)}
										</button>

										<button
											type="button"
											onClick={() => onDelete(item.id)}
											aria-label="Excluir item do histórico"
											title="Excluir"
											className="p-1 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors outline-none cursor-pointer"
										>
											<X size={12} />
										</button>
									</div>
								</div>

								{/* Área de Seleção (Expressão e Resultado) */}
								<button
									type="button"
									onClick={() => onSelect(item.result)}
									aria-label={`Usar resultado ${item.result}`}
									className="text-left outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded-xl p-0.5 cursor-pointer"
								>
									{item.productName && item.quantity && item.unitPrice ? (
										<p className="text-[11px] text-zinc-400 font-mono truncate max-w-full">
											{item.quantity} un × R$ {formatNumberPtBR(String(item.unitPrice))}
										</p>
									) : (
										<p className="text-[11px] text-zinc-400 font-mono truncate max-w-full">
											{formatDisplay(item.expression)}
										</p>
									)}
									<p className="text-white text-sm sm:text-base font-light tracking-tight truncate max-w-full mt-0.5">
										= R$ {formatNumberPtBR(item.result)}
									</p>
								</button>

								{/* Modal / Popover Inline de Edição de Tag */}
								<AnimatePresence>
									{tagEditingId === item.id && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											transition={{ duration: 0.15 }}
											className="mt-2 pt-2 border-t border-white/8 space-y-1.5"
										>
											<div className="flex items-center gap-1.5">
												<input
													type="text"
													value={customTagInput}
													onChange={(e) => setCustomTagInput(e.target.value)}
													placeholder="Nome da tag (ex: Aluguel)"
													className="flex-1 bg-zinc-800 border border-white/15 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-cyan-400"
													autoFocus
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															handleSaveTag(item.id, customTagInput);
														} else if (e.key === "Escape") {
															setTagEditingId(null);
														}
													}}
												/>
												<button
													type="button"
													onClick={() => handleSaveTag(item.id, customTagInput)}
													className="px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-medium cursor-pointer"
												>
													Salvar
												</button>
												{item.tag && (
													<button
														type="button"
														onClick={() => handleSaveTag(item.id, undefined)}
														className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"
														title="Remover tag"
													>
														<Trash2 size={12} />
													</button>
												)}
											</div>

											{/* Presets de Tags Rápidas */}
											<div className="flex flex-wrap gap-1 pt-0.5">
												{PRESET_TAGS.map((pt) => (
													<button
														key={pt.label}
														type="button"
														onClick={() => handleSaveTag(item.id, `${pt.icon} ${pt.label}`)}
														className="px-1.5 py-0.5 bg-white/4 hover:bg-white/10 text-zinc-300 rounded text-[10px] border border-white/6 cursor-pointer"
													>
														{pt.icon} {pt.label}
													</button>
												))}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			)}
		</div>
	);
});
