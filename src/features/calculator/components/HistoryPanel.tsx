import { AnimatePresence, motion } from "framer-motion";
import {
	BarChart3,
	Check,
	Clock,
	Copy,
	Download,
	Edit3,
	FileSpreadsheet,
	FileText,
	ListOrdered,
	PieChart,
	Receipt,
	Search,
	Share2,
	ShoppingBag,
	Tag,
	Trash2,
	X,
} from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { ThemeConfig } from "../hooks/useThemes";
import type { HistoryItem } from "../types";
import {
	formatCurrencyInput,
	formatDisplay,
	formatNumberPtBR,
	parseCurrencyToNumber,
} from "../utils/format";
import { BudgetBar } from "./BudgetBar";
import { ExpenseChart } from "./ExpenseChart";

type Props = {
	history: HistoryItem[];
	onSelect: (value: string) => void;
	onDelete: (id: string) => void;
	onUpdateTag?: (id: string, tag?: string) => void;
	onUpdateItem?: (
		id: string,
		updates: {
			productName?: string;
			quantity?: number;
			unitPrice?: number;
			tag?: string;
		},
	) => void;
	onClearAll?: () => void;
	onClose?: () => void;
	onOpenReceiptImage?: () => void;
	onOpenAnalytics?: () => void;
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
	onUpdateItem,
	onClearAll,
	onClose,
	onOpenReceiptImage,
	onOpenAnalytics,
	theme,
}: Props) {
	const [activeTab, setActiveTab] = useState<"list" | "chart">("list");
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [tagEditingId, setTagEditingId] = useState<string | null>(null);
	const [customTagInput, setCustomTagInput] = useState("");
	const [showExportMenu, setShowExportMenu] = useState(false);
	const exportRef = useRef<HTMLDivElement>(null);

	// Estado de Busca e Filtro de Tags
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTagFilter, setSelectedTagFilter] = useState<string>("all");

	// Estado de Edição de Item
	const [editingItemId, setEditingItemId] = useState<string | null>(null);
	const [editName, setEditName] = useState("");
	const [editPrice, setEditPrice] = useState("");
	const [editQty, setEditQty] = useState(1);

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

			const name = item.productName || item.tag || `Item #${history.length - idx}`;
			const qty = item.quantity || 1;
			const unitPrice = item.unitPrice !== undefined ? item.unitPrice : numRes / qty;
			const unitStr = formatNumberPtBR(unitPrice.toFixed(2));
			const totalStr = formatNumberPtBR(numRes.toFixed(2));

			return `${idx + 1}. *${name}* — ${qty} un × R$ ${unitStr} = *R$ ${totalStr}*`;
		});

		const msg = `🛒 *CUPOM DE COMPRAS — SMARTCALC*
━━━━━━━━━━━━━━━━━━━━
${lines.join("\n")}
━━━━━━━━━━━━━━━━━━━━
💰 *Total = R$ ${formatNumberPtBR(totalSum.toFixed(2))}* (${history.length} itens)
_Calculado via SmartCalc_`;

		navigator.clipboard.writeText(msg);
		toast.success("Cupom copiado! Pronto para colar no WhatsApp.", {
			description: `${history.length} itens acumulados • Total = R$ ${formatNumberPtBR(totalSum.toFixed(2))}`,
		});
	};

	// Exportar como TXT
	const handleExportTXT = () => {
		setShowExportMenu(false);
		if (history.length === 0) return;
		const content = history
			.map((item, idx) => {
				const productPart = item.productName ? ` [${item.productName}]` : "";
				const tagPart = item.tag ? ` {${item.tag}}` : "";
				const numRes = Number(item.result) || 0;
				const qty = item.quantity || 1;
				const unitPrice = item.unitPrice !== undefined ? item.unitPrice : numRes / qty;
				const priceDetail =
					item.productName || item.unitPrice || item.quantity
						? ` (${qty} un × R$ ${formatNumberPtBR(unitPrice.toFixed(2))})`
						: "";
				const datePart = item.timestamp
					? ` (${new Date(item.timestamp).toLocaleString("pt-BR")})`
					: "";
				return `${idx + 1}.${productPart}${tagPart} ${formatDisplay(item.expression)} = R$ ${formatNumberPtBR(item.result)}${priceDetail}${datePart}`;
			})
			.join("\n");

		const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `historico-calculadora-${new Date().toISOString().slice(0, 10)}.txt`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Arquivo de texto (.txt) baixado com sucesso!");
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
				const numRes = Number(item.result) || 0;
				const unitPrice = item.unitPrice !== undefined ? item.unitPrice : numRes / qty;
				const unit = formatNumberPtBR(unitPrice.toFixed(2));
				const expr = formatDisplay(item.expression).replace(/;/g, ",");
				const res = formatNumberPtBR(numRes.toFixed(2));
				return `${idx + 1};${dateStr};${timeStr};"${prod}";"${tag}";${qty};"${unit}";"${expr}";"${res}"`;
			})
			.join("\n");

		const blob = new Blob([`\uFEFF${headers}${rows}`], {
			type: "text/csv;charset=utf-8;",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `historico-smartcalc-${new Date().toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Planilha Excel (.csv) gerada com sucesso!");
	};

	const handleSaveTag = (id: string, tagValue?: string) => {
		onUpdateTag?.(id, tagValue);
		setTagEditingId(null);
		setCustomTagInput("");
	};

	// Tags dinâmicas presentes nos itens do histórico
	const availableTags = useMemo(() => {
		const set = new Set<string>();
		for (const item of history) {
			if (item.tag) set.add(item.tag);
		}
		return Array.from(set);
	}, [history]);

	// Itens filtrados por busca textual e tag selecionada
	const filteredHistory = useMemo(() => {
		return history.filter((item) => {
			if (selectedTagFilter !== "all") {
				if (item.tag !== selectedTagFilter) return false;
			}
			if (!searchQuery.trim()) return true;
			const q = searchQuery.toLowerCase().trim();
			const matchName = item.productName?.toLowerCase().includes(q);
			const matchTag = item.tag?.toLowerCase().includes(q);
			const matchExpr = item.expression.toLowerCase().includes(q);
			const matchRes = item.result.toLowerCase().includes(q);
			return Boolean(matchName || matchTag || matchExpr || matchRes);
		});
	}, [history, selectedTagFilter, searchQuery]);

	const filteredTotal = useMemo(() => {
		return filteredHistory.reduce((acc, curr) => acc + (Number(curr.result) || 0), 0);
	}, [filteredHistory]);

	const fullTotal = useMemo(() => {
		return history.reduce((acc, curr) => acc + (Number(curr.result) || 0), 0);
	}, [history]);

	const isFilterActive = searchQuery.trim().length > 0 || selectedTagFilter !== "all";

	// Iniciar edição de item
	const startEditing = (item: HistoryItem) => {
		setEditingItemId(item.id);
		setEditName(item.productName || "");
		const numRes = Number(item.result) || 0;
		const qty = item.quantity || 1;
		const unitPrice = item.unitPrice !== undefined ? item.unitPrice : numRes / qty;
		setEditPrice(formatNumberPtBR(unitPrice.toFixed(2)));
		setEditQty(qty);
	};

	const cancelEditing = () => {
		setEditingItemId(null);
		setEditName("");
		setEditPrice("");
		setEditQty(1);
	};

	const saveEditing = (id: string) => {
		const parsedPrice = parseCurrencyToNumber(editPrice);
		if (parsedPrice < 0 || editQty <= 0) {
			toast.error("Informe um preço e quantidade válidos.");
			return;
		}
		onUpdateItem?.(id, {
			productName: editName.trim() || undefined,
			unitPrice: parsedPrice,
			quantity: editQty,
		});
		cancelEditing();
		toast.success("Item atualizado!");
	};

	return (
		<div className="h-full flex flex-col justify-between select-none overflow-hidden relative">
			{/* Header do Histórico */}
			<div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/8 shrink-0">
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
											{onOpenAnalytics && (
												<button
													type="button"
													onClick={() => {
														setShowExportMenu(false);
														onOpenAnalytics();
													}}
													className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-zinc-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left font-medium"
												>
													<BarChart3 size={13} className="text-amber-400" />
													<span>Estatísticas & Gráficos</span>
												</button>
											)}
											<button
												type="button"
												onClick={() => {
													setShowExportMenu(false);
													onOpenReceiptImage?.();
												}}
												className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-zinc-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left font-medium"
											>
												<Receipt size={13} className="text-cyan-400" />
												<span>Cupom em Imagem (.png)</span>
											</button>
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

					{/* Botão de Fechar Painel do Histórico */}
					{onClose && (
						<button
							type="button"
							onClick={onClose}
							aria-label="Fechar painel do histórico"
							title="Fechar painel"
							className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/8 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer ml-1"
						>
							<X size={14} />
						</button>
					)}
				</div>
			</div>

			{/* Barra de Meta de Gastos / Limite de Orçamento */}
			<BudgetBar currentTotal={fullTotal} />

			{/* Barra de Pesquisa e Filtros de Categoria (Quando houver histórico) */}
			{history.length > 0 && (
				<div className="space-y-1.5 mb-2">
					{/* Campo de Busca Rápida */}
					<div className="relative flex items-center">
						<Search size={12} className="absolute left-2.5 text-zinc-400 pointer-events-none" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Buscar produto, conta ou valor..."
							className="w-full pl-7 pr-7 py-1 rounded-xl bg-white/4 hover:bg-white/6 focus:bg-zinc-900 border border-white/8 focus:border-cyan-500/40 text-[11px] text-zinc-200 placeholder-zinc-500 outline-none transition-all"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								className="absolute right-2 text-zinc-400 hover:text-white p-0.5 cursor-pointer"
								title="Limpar busca"
							>
								<X size={11} />
							</button>
						)}
					</div>

					{/* Chips Roláveis de Filtro de Tags */}
					{availableTags.length > 0 && (
						<div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
							<button
								type="button"
								onClick={() => setSelectedTagFilter("all")}
								className={`px-2 py-0.5 rounded-full border shrink-0 transition-all cursor-pointer ${
									selectedTagFilter === "all"
										? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold shadow-xs"
										: "bg-white/3 text-zinc-400 border-white/6 hover:text-white hover:bg-white/8"
								}`}
							>
								Todos ({history.length})
							</button>
							{availableTags.map((t) => {
								const count = history.filter((item) => item.tag === t).length;
								return (
									<button
										key={t}
										type="button"
										onClick={() => setSelectedTagFilter(t)}
										className={`px-2 py-0.5 rounded-full border shrink-0 transition-all cursor-pointer ${
											selectedTagFilter === t
												? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold shadow-xs"
												: "bg-white/3 text-zinc-400 border-white/6 hover:text-white hover:bg-white/8"
										}`}
									>
										{t} ({count})
									</button>
								);
							})}
						</div>
					)}

					{/* Banner Informativo de Filtro Ativo */}
					{isFilterActive && (
						<div className="flex items-center justify-between px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-300">
							<span>
								{filteredHistory.length} de {history.length} itens • Subtotal:{" "}
								<strong className="font-mono">
									R$ {formatNumberPtBR(filteredTotal.toFixed(2))}
								</strong>
							</span>
							<button
								type="button"
								onClick={() => {
									setSearchQuery("");
									setSelectedTagFilter("all");
								}}
								className="underline hover:text-white cursor-pointer ml-1"
							>
								Limpar
							</button>
						</div>
					)}
				</div>
			)}

			{/* Alternador de Visualização (Extrato vs Gráfico) */}
			{history.length > 0 && (
				<div className="grid grid-cols-2 gap-1 p-1 bg-zinc-950/80 rounded-xl border border-white/6 mb-2">
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
					{filteredHistory.length === 0 ? (
						<div className="py-8 text-center space-y-2">
							<p className="text-xs text-zinc-400">Nenhum item encontrado nesta busca.</p>
							<button
								type="button"
								onClick={() => {
									setSearchQuery("");
									setSelectedTagFilter("all");
								}}
								className="text-[11px] text-cyan-400 hover:underline cursor-pointer font-medium"
							>
								Limpar filtros de busca
							</button>
						</div>
					) : (
						<AnimatePresence mode="popLayout">
							{filteredHistory.map((item) => (
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

										{/* Ações Rápidas (Editar / Copiar / Excluir) */}
										<div className="shrink-0 flex items-center gap-1 opacity-60 group-hover/item:opacity-100 transition-opacity">
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													startEditing(item);
												}}
												aria-label="Editar item"
												title="Editar item (preço, quantidade ou nome)"
												className="p-1 rounded-lg text-zinc-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors outline-none cursor-pointer"
											>
												<Edit3 size={12} />
											</button>

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
										{item.productName || item.unitPrice ? (
											<div className="space-y-0.5">
												<p className="text-xs text-zinc-200 font-mono truncate max-w-full font-medium">
													{item.productName || "Sem nome"}
												</p>
												<p className="text-[11px] text-zinc-400 font-mono">
													{item.quantity || 1} un × R${" "}
													{formatNumberPtBR(
														(item.unitPrice !== undefined
															? item.unitPrice
															: (Number(item.result) || 0) / (item.quantity || 1)
														).toFixed(2),
													)}
												</p>
											</div>
										) : (
											<p className="text-[11px] text-zinc-400 font-mono truncate max-w-full">
												{formatDisplay(item.expression)}
											</p>
										)}
										<p className="text-white text-sm sm:text-base font-semibold tracking-tight truncate max-w-full mt-0.5 flex items-center gap-1">
											<span>= R$ {formatNumberPtBR(item.result)}</span>
											<span className="text-xs text-cyan-400 font-mono font-bold">+</span>
										</p>
									</button>

									{/* Formulário Inline de Edição de Item */}
									<AnimatePresence>
										{editingItemId === item.id && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												transition={{ duration: 0.15 }}
												className="mt-2 pt-2 border-t border-cyan-500/20 bg-zinc-950/70 p-2 rounded-xl space-y-2 text-left"
											>
												<div className="flex items-center justify-between text-[10px] text-cyan-300 font-medium">
													<span>Editar Item</span>
													<button
														type="button"
														onClick={cancelEditing}
														className="text-zinc-500 hover:text-white p-0.5 cursor-pointer"
													>
														<X size={11} />
													</button>
												</div>

												<div className="space-y-1.5">
													<input
														type="text"
														value={editName}
														onChange={(e) => setEditName(e.target.value)}
														placeholder="Nome do produto (opcional)"
														className="w-full bg-zinc-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400"
													/>

													<div className="grid grid-cols-2 gap-1.5">
														<div>
															<span className="text-[9px] text-zinc-400 uppercase tracking-wider block mb-0.5">
																Preço Unit. (R$)
															</span>
															<input
																type="text"
																value={editPrice}
																onChange={(e) => setEditPrice(formatCurrencyInput(e.target.value))}
																className="w-full bg-zinc-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-cyan-400 font-mono"
															/>
														</div>

														<div>
															<span className="text-[9px] text-zinc-400 uppercase tracking-wider block mb-0.5">
																Quantidade
															</span>
															<div className="flex items-center gap-1 bg-zinc-800 border border-white/10 rounded-lg px-1 py-0.5">
																<button
																	type="button"
																	onClick={() => setEditQty((q) => Math.max(1, q - 1))}
																	className="w-5 h-5 rounded flex items-center justify-center text-xs text-zinc-300 hover:bg-white/10 cursor-pointer"
																>
																	-
																</button>
																<span className="flex-1 text-center text-xs text-white font-mono">
																	{editQty}
																</span>
																<button
																	type="button"
																	onClick={() => setEditQty((q) => q + 1)}
																	className="w-5 h-5 rounded flex items-center justify-center text-xs text-zinc-300 hover:bg-white/10 cursor-pointer"
																>
																	+
																</button>
															</div>
														</div>
													</div>

													<div className="flex items-center justify-between pt-1">
														<span className="text-[10px] text-zinc-400">
															Total:{" "}
															<strong className="text-cyan-300 font-mono">
																R${" "}
																{formatNumberPtBR(
																	(parseCurrencyToNumber(editPrice) * editQty).toFixed(2),
																)}
															</strong>
														</span>

														<div className="flex items-center gap-1">
															<button
																type="button"
																onClick={cancelEditing}
																className="px-2 py-0.5 rounded-lg text-[10px] text-zinc-400 hover:text-white border border-white/10 cursor-pointer"
															>
																Cancelar
															</button>
															<button
																type="button"
																onClick={() => saveEditing(item.id)}
																className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 cursor-pointer"
															>
																Salvar
															</button>
														</div>
													</div>
												</div>
											</motion.div>
										)}
									</AnimatePresence>

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
					)}
				</div>
			)}

			{/* Rodapé com Total Acumulado */}
			{history.length > 0 && activeTab === "list" && (
				<div className="pt-2 mt-auto border-t border-white/8 flex items-center justify-between px-2 bg-white/2 rounded-xl py-1.5 shrink-0 gap-2">
					<div className="flex items-center gap-1.5">
						<ShoppingBag size={13} className={theme?.accentText ?? "text-cyan-400"} />
						<span className="text-[11px] uppercase font-mono text-zinc-300 font-semibold">
							{isFilterActive ? "Subtotal" : "Total"}
						</span>
						<span className="text-[10px] text-zinc-500 font-mono">
							({filteredHistory.length}/{history.length})
						</span>
					</div>
					<div className="flex items-center gap-2">
						{onOpenReceiptImage && (
							<button
								type="button"
								onClick={onOpenReceiptImage}
								title="Gerar Cupom em Imagem PNG"
								className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[10px] font-semibold transition-all cursor-pointer active:scale-95"
							>
								<Receipt size={11} />
								<span>Cupom</span>
							</button>
						)}
						<span className="text-sm sm:text-base font-extrabold text-cyan-300 font-mono">
							= R$ {formatNumberPtBR(filteredTotal.toFixed(2))}
						</span>
					</div>
				</div>
			)}
		</div>
	);
});
