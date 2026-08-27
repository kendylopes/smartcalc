import { BarChart3, Coins, Database, Fuel, HelpCircle, Repeat, Scale, Tag, TrendingUp, Users } from "lucide-react";
import { memo } from "react";
import type { ThemeConfig } from "../hooks/useThemes";

type Props = {
	onOpenComparator: () => void;
	onOpenSplitBill: () => void;
	onOpenFinance: () => void;
	onOpenConverter: () => void;
	onOpenAnalytics?: () => void;
	onOpenFuel?: () => void;
	onOpenDiscount?: () => void;
	onOpenHelp: () => void;
	onOpenBackup: () => void;
	theme?: ThemeConfig;
	onPlayClick?: () => void;
};

export const QuickToolsPanel = memo(function QuickToolsPanel({
	onOpenComparator,
	onOpenSplitBill,
	onOpenFinance,
	onOpenConverter,
	onOpenAnalytics,
	onOpenFuel,
	onOpenDiscount,
	onOpenHelp,
	onOpenBackup,
	theme,
	onPlayClick,
}: Props) {
	const tools = [
		{
			id: "analytics",
			name: "Estatísticas & Gráficos",
			desc: "Resumo de gastos e compras",
			icon: <BarChart3 size={16} />,
			shortcut: "G",
			action: onOpenAnalytics || onOpenComparator,
			color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
		},
		{
			id: "comparator",
			name: "Comparador",
			desc: "Qual embalagem compensa mais?",
			icon: <Scale size={16} />,
			shortcut: "P",
			action: onOpenComparator,
			color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
		},
		{
			id: "fuel",
			name: "Etanol vs Gasolina",
			desc: "Qual combustível compensa?",
			icon: <Fuel size={16} />,
			shortcut: "G",
			action: onOpenFuel || onOpenComparator,
			color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
		},
		{
			id: "discount",
			name: "Desconto & Margem",
			desc: "Preço % OFF e lucro markup",
			icon: <Tag size={16} />,
			shortcut: "M",
			action: onOpenDiscount || onOpenFinance,
			color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
		},
		{
			id: "split",
			name: "Divisor de Conta",
			desc: "Dividir consumo & taxa de 10%",
			icon: <Users size={16} />,
			shortcut: "D",
			action: onOpenSplitBill,
			color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
		},
		{
			id: "finance",
			name: "Simulador Financeiro",
			desc: "Parcelamento & juros compostos",
			icon: <TrendingUp size={16} />,
			shortcut: "F",
			action: onOpenFinance,
			color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
		},
		{
			id: "converter",
			name: "Conversor",
			desc: "Cotação USD, EUR e medidas",
			icon: <Repeat size={16} />,
			shortcut: "U",
			action: onOpenConverter,
			color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
		},
	];

	return (
		<aside className="relative w-full max-w-72 overflow-hidden rounded-[2.4rem] neu-panel p-4 flex flex-col justify-between select-none">
			<div className="space-y-3">
				{/* Cabeçalho */}
				<div className="flex items-center justify-between pb-2.5 border-b border-white/8">
					<div className="flex items-center gap-2">
						<div
							className={`p-1.5 rounded-xl ${theme?.operatorBgActive ?? "bg-cyan-500/10"} ${theme?.accentText ?? "text-cyan-400"}`}
						>
							<Coins size={14} />
						</div>
						<span className="text-xs font-bold text-zinc-200 tracking-wide">
							Ferramentas Rápidas
						</span>
					</div>
					<span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-white/5">
						Estúdio
					</span>
				</div>

				{/* Lista de Ferramentas */}
				<div className="space-y-2">
					{tools.map((tool) => (
						<button
							key={tool.id}
							type="button"
							onClick={() => {
								onPlayClick?.();
								tool.action();
							}}
							className="
								w-full
								p-2.5
								rounded-2xl
								bg-white/4
								hover:bg-white/8
								border
								border-white/6
								hover:border-white/12
								flex
								items-center
								justify-between
								gap-3
								transition-all
								duration-150
								active:scale-98
								text-left
								group
								cursor-pointer
							"
						>
							<div className="flex items-center gap-2.5 min-w-0">
								<div className={`p-2 rounded-xl border shrink-0 ${tool.color}`}>{tool.icon}</div>
								<div className="min-w-0">
									<h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
										{tool.name}
									</h4>
									<p className="text-[10px] text-zinc-400 truncate">{tool.desc}</p>
								</div>
							</div>
							<kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-zinc-400 group-hover:text-zinc-200 shrink-0">
								{tool.shortcut}
							</kbd>
						</button>
					))}
				</div>
			</div>

			{/* Rodapé do Painel */}
			<div className="pt-3 border-t border-white/8 space-y-1.5 mt-3">
				<button
					type="button"
					onClick={() => {
						onPlayClick?.();
						onOpenBackup();
					}}
					className="w-full py-2 px-3 rounded-xl bg-white/4 hover:bg-white/8 text-zinc-400 hover:text-zinc-200 flex items-center justify-between text-xs transition-colors cursor-pointer"
				>
					<div className="flex items-center gap-2">
						<Database size={13} className="text-cyan-400" />
						<span>Backup de Dados</span>
					</div>
					<span className="text-[10px] text-zinc-500 font-mono">.json</span>
				</button>

				<button
					type="button"
					onClick={() => {
						onPlayClick?.();
						onOpenHelp();
					}}
					className="w-full py-2 px-3 rounded-xl bg-white/4 hover:bg-white/8 text-zinc-400 hover:text-zinc-200 flex items-center justify-between text-xs transition-colors cursor-pointer"
				>
					<div className="flex items-center gap-2">
						<HelpCircle size={13} className="text-purple-400" />
						<span>Guia & Central de Ajuda</span>
					</div>
					<kbd className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono text-zinc-400">
						H
					</kbd>
				</button>
			</div>
		</aside>
	);
});
