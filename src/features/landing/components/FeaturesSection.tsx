import {
	ArrowRight,
	Fuel,
	PieChart,
	Repeat,
	Scale,
	ShoppingBag,
	Sparkles,
	Tag,
	TrendingUp,
	Users,
} from "lucide-react";
import { memo } from "react";
import type { ThemeConfig } from "@/features/calculator/hooks/useThemes";

type Props = {
	theme?: ThemeConfig;
	onOpenComparator: () => void;
	onOpenSplitBill: () => void;
	onOpenFinance: () => void;
	onOpenConverter: () => void;
	onOpenQuantity: () => void;
	onOpenFuel?: () => void;
	onOpenDiscount?: () => void;
	onOpenAnalytics?: () => void;
};

export const FeaturesSection = memo(function FeaturesSection({
	onOpenComparator,
	onOpenSplitBill,
	onOpenFinance,
	onOpenConverter,
	onOpenQuantity,
	onOpenFuel,
	onOpenDiscount,
	onOpenAnalytics,
}: Props) {
	const features = [
		{
			id: "market",
			title: "Modo Supermercado & Cupom WhatsApp",
			description:
				"Adicione itens com quantidade e preço unitário. Gere um cupom formatado com total e envie no WhatsApp da família em 1 segundo.",
			icon: <ShoppingBag size={22} />,
			badge: "Compras Rápidas",
			color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
			action: onOpenQuantity,
			actionLabel: "Calcular Compras",
		},
		{
			id: "fuel",
			title: "Calculadora Flex (Etanol vs Gasolina)",
			description:
				"Descubra instantaneamente qual combustível compensa no posto pela regra dos 70% ou pelo consumo real do seu veículo em km/l.",
			icon: <Fuel size={22} />,
			badge: "Economia no Posto",
			color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
			action: onOpenFuel || onOpenComparator,
			actionLabel: "Calcular Combustível",
		},
		{
			id: "discount",
			title: "Calculadora de Desconto & Margem",
			description:
				"Calcule descontos com % OFF e total economizado, ou defina preços de venda e margens de lucro comercial (markup).",
			icon: <Tag size={22} />,
			badge: "Comércio & Ofertas",
			color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
			action: onOpenDiscount || onOpenFinance,
			actionLabel: "Calcular Desconto",
		},
		{
			id: "comparator",
			title: "Comparador de Embalagens (kg / L / un)",
			description:
				"Descubra se o pacote de 500g ou 1kg compensa mais. O SmartCalc calcula o valor por quilo e mostra a porcentagem exata de economia.",
			icon: <Scale size={22} />,
			badge: "Economia Real",
			color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
			action: onOpenComparator,
			actionLabel: "Comparar Preços",
		},
		{
			id: "split",
			title: "Divisor de Contas & Gorjetas",
			description:
				"Divida o consumo do restaurante, barzinho ou churrasco entre amigos com taxa de serviço configurável (0% a 25%) e mensagem pronta.",
			icon: <Users size={22} />,
			badge: "Sem Confusão",
			color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
			action: onOpenSplitBill,
			actionLabel: "Dividir Conta",
		},
		{
			id: "finance",
			title: "Simulador de Parcelas & Juros",
			description:
				"Calcule o valor real das parcelas com taxa de juros ou simule rendimentos de investimentos e poupança a juros compostos.",
			icon: <TrendingUp size={22} />,
			badge: "Planejamento",
			color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
			action: onOpenFinance,
			actionLabel: "Simular Finanças",
		},
		{
			id: "converter",
			title: "Conversor de Moedas & Cotações",
			description:
				"Converta Dólar (USD), Euro (EUR), Libra e Bitcoin para Real Brasileiro (BRL) e converta unidades de peso, comprimento e temperatura.",
			icon: <Repeat size={22} />,
			badge: "Câmbio Direto",
			color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
			action: onOpenConverter,
			actionLabel: "Converter Moeda",
		},
		{
			id: "chart",
			title: "Gráfico de Gastos por Categoria",
			description:
				"Classificação inteligente automática dos seus gastos em 7 categorias (Açougue, Hortifrúti, Mercearia, Limpeza, etc.) com gráfico visual.",
			icon: <PieChart size={22} />,
			badge: "Análise Visual",
			color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
			action: onOpenAnalytics,
			actionLabel: "Ver Gráficos & Estatísticas",
		},
	];

	return (
		<section id="recursos" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
			{/* Cabeçalho da Seção */}
			<div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
				<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
					<Sparkles size={13} />
					<span>Recursos Inteligentes</span>
				</div>
				<h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
					Muito mais que uma simples calculadora
				</h2>
				<p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
					Desenvolvida para resolver as contas do mundo real: do carrinho de supermercado às
					finanças pessoais e momentos com amigos.
				</p>
			</div>

			{/* Grid de Recursos */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
				{features.map((feat) => (
					<div
						key={feat.id}
						className="
							relative
							rounded-4xl
							neu-panel
							p-6
							flex
							flex-col
							justify-between
							group
							hover:border-white/15
							transition-all
							duration-200
						"
					>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div className={`p-3 rounded-2xl border ${feat.color}`}>{feat.icon}</div>
								<span className="text-[11px] font-semibold text-zinc-400 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/8">
									{feat.badge}
								</span>
							</div>

							<div className="space-y-1.5">
								<h3 className="text-base font-bold text-zinc-100 group-hover:text-white transition-colors">
									{feat.title}
								</h3>
								<p className="text-xs text-zinc-400 leading-relaxed">{feat.description}</p>
							</div>
						</div>

						<div className="pt-5 mt-4 border-t border-white/8">
							<button
								type="button"
								onClick={feat.action}
								className="
									w-full
									py-2.5
									px-3
									rounded-xl
									bg-white/4
									hover:bg-white/8
									border
									border-white/8
									hover:border-white/15
									text-xs
									font-semibold
									text-zinc-200
									hover:text-white
									flex
									items-center
									justify-center
									gap-2
									transition-all
									cursor-pointer
									active:scale-98
								"
							>
								<span>{feat.actionLabel}</span>
								<ArrowRight
									size={13}
									className="group-hover:translate-x-0.5 transition-transform"
								/>
							</button>
						</div>
					</div>
				))}
			</div>
		</section>
	);
});
