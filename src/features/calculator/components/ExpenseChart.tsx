import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
	PieChart,
	Sparkles,
} from "lucide-react";
import type { ThemeConfig } from "../hooks/useThemes";
import type { HistoryItem } from "../types";
import { formatNumberPtBR } from "../utils/format";

type Props = {
	history: HistoryItem[];
	theme?: ThemeConfig;
};

type CategoryInfo = {
	id: string;
	name: string;
	icon: string;
	color: string;
	bgClass: string;
	borderClass: string;
	textClass: string;
	keywords: string[];
};

const CATEGORIES: CategoryInfo[] = [
	{
		id: "butcher",
		name: "Açougue & Carnes",
		icon: "🥩",
		color: "#f87171", // red-400
		bgClass: "bg-red-500/10",
		borderClass: "border-red-500/25",
		textClass: "text-red-400",
		keywords: [
			"carne",
			"frango",
			"peixe",
			"picanha",
			"bife",
			"linguiça",
			"alcatra",
			"costela",
			"bacon",
			"ovo",
			"ovos",
			"salmão",
			"camarão",
			"suíno",
			"porco",
		],
	},
	{
		id: "dairy",
		name: "Laticínios & Frios",
		icon: "🧀",
		color: "#fbbf24", // amber-400
		bgClass: "bg-amber-500/10",
		borderClass: "border-amber-500/25",
		textClass: "text-amber-400",
		keywords: [
			"leite",
			"queijo",
			"manteiga",
			"iogurte",
			"requeijão",
			"presunto",
			"mussarela",
			"prato",
			"creme de leite",
			"leite condensado",
			"nata",
			"ricota",
		],
	},
	{
		id: "produce",
		name: "Hortifrúti & Feira",
		icon: "🥦",
		color: "#34d399", // emerald-400
		bgClass: "bg-emerald-500/10",
		borderClass: "border-emerald-500/25",
		textClass: "text-emerald-400",
		keywords: [
			"fruta",
			"legume",
			"verdura",
			"tomate",
			"banana",
			"maçã",
			"batata",
			"cebola",
			"alho",
			"alface",
			"cenoura",
			"laranja",
			"limão",
			"manga",
			"abacaxi",
			"uva",
			"melancia",
		],
	},
	{
		id: "grocery",
		name: "Mercearia & Básicos",
		icon: "🍚",
		color: "#38bdf8", // sky-400
		bgClass: "bg-sky-500/10",
		borderClass: "border-sky-500/25",
		textClass: "text-sky-400",
		keywords: [
			"arroz",
			"feijão",
			"pão",
			"café",
			"açúcar",
			"óleo",
			"macarrão",
			"farinha",
			"molho",
			"sal",
			"azeite",
			"vinagre",
			"trigo",
			"aveia",
			" cereal",
		],
	},
	{
		id: "cleaning",
		name: "Limpeza & Higiene",
		icon: "🧼",
		color: "#c084fc", // purple-400
		bgClass: "bg-purple-500/10",
		borderClass: "border-purple-500/25",
		textClass: "text-purple-400",
		keywords: [
			"sabão",
			"detergente",
			"amaciante",
			"desinfetante",
			"papel",
			"shampoo",
			"condicionador",
			"sabonete",
			"pasta",
			"escova",
			"esponja",
			"água sanitária",
			"limpador",
		],
	},
	{
		id: "drinks",
		name: "Bebidas & Snacks",
		icon: "🧃",
		color: "#fb7185", // rose-400
		bgClass: "bg-rose-500/10",
		borderClass: "border-rose-500/25",
		textClass: "text-rose-400",
		keywords: [
			"refrigerante",
			"suco",
			"água",
			"cerveja",
			"vinho",
			"biscoito",
			"bolacha",
			"salgadinho",
			"chocolate",
			"doce",
			"bala",
			"energético",
		],
	},
	{
		id: "general",
		name: "Geral & Outros",
		icon: "📦",
		color: "#94a3b8", // slate-400
		bgClass: "bg-slate-500/10",
		borderClass: "border-slate-500/25",
		textClass: "text-slate-400",
		keywords: [],
	},
];

// Identifica a categoria a partir do nome ou tag do produto
function categorizeItem(item: HistoryItem): CategoryInfo {
	const text = `${item.productName || ""} ${item.tag || ""}`.toLowerCase().trim();

	if (!text) {
		return CATEGORIES[CATEGORIES.length - 1]; // Geral
	}

	for (const cat of CATEGORIES) {
		if (cat.keywords.some((kw) => text.includes(kw))) {
			return cat;
		}
	}

	return CATEGORIES[CATEGORIES.length - 1]; // Geral
}

export const ExpenseChart = memo(function ExpenseChart({ history }: Props) {
	// Agrupa gastos por categoria
	const { breakdown, totalSpent, topCategory } = useMemo(() => {
		let total = 0;
		const map = new Map<string, { category: CategoryInfo; amount: number; count: number }>();

		for (const item of history) {
			const val = Number(item.result) || 0;
			total += val;

			const cat = categorizeItem(item);
			const current = map.get(cat.id) || { category: cat, amount: 0, count: 0 };
			current.amount += val;
			current.count += (item.quantity || 1);
			map.set(cat.id, current);
		}

		const list = Array.from(map.values())
			.map((item) => ({
				...item,
				percentage: total > 0 ? (item.amount / total) * 100 : 0,
			}))
			.sort((a, b) => b.amount - a.amount);

		const top = list.length > 0 && list[0].amount > 0 ? list[0] : null;

		return {
			breakdown: list,
			totalSpent: total,
			topCategory: top,
		};
	}, [history]);

	if (history.length === 0 || totalSpent <= 0) {
		return (
			<div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
				<div className="w-10 h-10 rounded-2xl bg-white/3 border border-white/6 flex items-center justify-center text-zinc-600 mb-2">
					<PieChart size={18} />
				</div>
				<p className="text-zinc-500 text-xs font-light">Adicione itens para ver o gráfico de gastos</p>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col justify-between space-y-3 overflow-y-auto pr-0.5 scrollbar-none">
			{/* 1. Barra de Distribuição Segmentada Contínua */}
			<div className="space-y-1.5 pt-1">
				<div className="flex items-center justify-between text-[11px] text-zinc-400">
					<span>Distribuição do Carrinho</span>
					<span className="font-mono text-zinc-300 font-semibold">
						R$ {formatNumberPtBR(totalSpent.toFixed(2))}
					</span>
				</div>

				<div className="h-3 w-full rounded-full bg-zinc-950 overflow-hidden flex p-0.5 border border-white/8 gap-0.5">
					{breakdown.map((item) => (
						<motion.div
							key={item.category.id}
							initial={{ width: 0 }}
							animate={{ width: `${Math.max(item.percentage, 2)}%` }}
							transition={{ duration: 0.4, ease: "easeOut" }}
							title={`${item.category.name}: R$ ${formatNumberPtBR(item.amount.toFixed(2))} (${Math.round(item.percentage)}%)`}
							style={{ backgroundColor: item.category.color }}
							className="h-full rounded-full transition-all"
						/>
					))}
				</div>
			</div>

			{/* 2. Card de Insight da Maior Despesa */}
			{topCategory && topCategory.percentage >= 15 && (
				<motion.div
					initial={{ opacity: 0, y: 4 }}
					animate={{ opacity: 1, y: 0 }}
					className="p-2.5 rounded-2xl bg-zinc-900/90 border border-white/8 flex items-center gap-2.5"
				>
					<div className={`p-2 rounded-xl border shrink-0 ${topCategory.category.bgClass} ${topCategory.category.borderClass}`}>
						<span className="text-base">{topCategory.category.icon}</span>
					</div>
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
							<Sparkles size={11} className="text-cyan-400" />
							<span>Maior Concentração</span>
						</div>
						<p className="text-xs font-semibold text-white truncate">
							{topCategory.category.name} ({Math.round(topCategory.percentage)}% do total)
						</p>
					</div>
				</motion.div>
			)}

			{/* 3. Lista Detalhada de Categorias com Progresso */}
			<div className="space-y-1.5 flex-1 max-h-70 overflow-y-auto pr-0.5 scrollbar-none">
				{breakdown.map((item) => (
					<div
						key={item.category.id}
						className="p-2 rounded-2xl bg-zinc-900/60 border border-white/6 hover:border-white/12 transition-all space-y-1"
					>
						<div className="flex items-center justify-between text-xs">
							<div className="flex items-center gap-1.5 min-w-0">
								<span className="text-sm shrink-0">{item.category.icon}</span>
								<span className="text-zinc-200 font-medium text-[11px] truncate">
									{item.category.name}
								</span>
								<span className="text-[10px] text-zinc-500 font-mono">
									({item.count} un)
								</span>
							</div>

							<div className="flex items-center gap-1.5 text-right shrink-0">
								<span className="font-mono text-xs font-semibold text-white">
									R$ {formatNumberPtBR(item.amount.toFixed(2))}
								</span>
								<span
									className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md font-mono"
									style={{
										backgroundColor: `${item.category.color}20`,
										color: item.category.color,
									}}
								>
									{Math.round(item.percentage)}%
								</span>
							</div>
						</div>

						{/* Barra de Progresso Individual */}
						<div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: `${item.percentage}%` }}
								transition={{ duration: 0.3 }}
								style={{ backgroundColor: item.category.color }}
								className="h-full rounded-full"
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});
