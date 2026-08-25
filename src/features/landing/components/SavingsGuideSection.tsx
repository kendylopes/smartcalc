import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lightbulb, Percent, Scale, ShoppingBag, TrendingUp } from "lucide-react";
import { memo, useState } from "react";

export const SavingsGuideSection = memo(function SavingsGuideSection() {
	const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

	const articles = [
		{
			id: 0,
			title: "Como saber se a embalagem maior realmente compensa no supermercado?",
			summary: "Nem sempre o tamanho 'econômico' ou 'família' é mais barato por unidade de medida.",
			content: `Muitas vezes as marcas cobram proporcionalmente mais caro em embalagens grandes aproveitando a falsa sensação de economia. Para não cair nessa pegadinha:
1. Sempre divida o preço pelo peso em gramas ou volume em ml.
2. Multiplique por 1000 para encontrar o custo por 1kg ou 1 litro.
3. No SmartCalc, abra a ferramenta "Comparar Embalagens" (atalho P), digite os dois valores e o app destaca automaticamente a opção vencedora com a porcentagem exata de economia.`,
			icon: <Scale size={18} className="text-amber-400" />,
		},
		{
			id: 1,
			title: "Como manter o controle do carrinho de compras e não estourar o orçamento?",
			summary: "Dicas práticas para somar os produtos antes de chegar ao caixa.",
			content: `Definir um teto de gastos antes de entrar no mercado evita compras por impulso:
1. Use a tecla 'Q' (Quantidade) para registrar produtos pesáveis ou múltiplos (ex: 3x R$ 4,50).
2. Defina uma 'Meta de Gastos' na barra de orçamento do SmartCalc. A barra muda de cor para amarelo aos 80% e vermelho caso você ultrapasse.
3. Ao finalizar, clique em 'Exportar para WhatsApp' e tenha o cupom completo salvo no seu celular.`,
			icon: <ShoppingBag size={18} className="text-cyan-400" />,
		},
		{
			id: 2,
			title: "Como calcular juros de parcelamento e saber o custo real da compra?",
			summary: "Aprenda a identificar a taxa embutida em compras 'a prazo'.",
			content: `Muitas lojas anunciam 'parcelas que cabem no bolso', mas a soma final pode ultrapassar 30% do valor à vista:
1. Multiplique o número de parcelas pelo valor mensal e compare com o preço à vista.
2. Utilize o 'Simulador de Finanças' do SmartCalc para calcular a taxa de juros exata da operação.
3. Se o desconto à vista for maior que o rendimento do dinheiro aplicado no mesmo período, prefira pagar à vista.`,
			icon: <TrendingUp size={18} className="text-purple-400" />,
		},
		{
			id: 3,
			title: "Como dividir a conta do restaurante com taxa de serviço sem complicação?",
			summary: "Evite discussões na hora de pagar a comanda do grupo.",
			content: `Rachar a comanda pode ser confuso quando há taxa de serviço ou gorjeta:
1. Digite o total da comanda no visor da calculadora.
2. Abra o 'Divisor de Contas' (atalho D), ajuste a quantidade de pessoas e a porcentagem da gorjeta (10%, 12% ou 0%).
3. Copie a mensagem pronta e envie no grupo do WhatsApp com o valor exato por pessoa e chave PIX para acerto.`,
			icon: <Percent size={18} className="text-emerald-400" />,
		},
	];

	return (
		<section id="dicas" className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto">
			{/* Cabeçalho */}
			<div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
				<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
					<Lightbulb size={13} />
					<span>Guia Prático de Economia</span>
				</div>
				<h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
					Dicas de Consumo Inteligente para o seu Dia a Dia
				</h2>
				<p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
					Entenda a matemática prática do cotidiano e aprenda a economizar centenas de reais todos
					os meses.
				</p>
			</div>

			{/* Acordeões de Conteúdo Rico para SEO */}
			<div className="space-y-3">
				{articles.map((art) => {
					const isOpen = activeAccordion === art.id;
					return (
						<div
							key={art.id}
							className="rounded-2xl neu-panel overflow-hidden border border-white/6 transition-all"
						>
							<button
								type="button"
								onClick={() => setActiveAccordion(isOpen ? null : art.id)}
								className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer outline-none hover:bg-white/2"
							>
								<div className="flex items-center gap-3 min-w-0">
									<div className="p-2 rounded-xl bg-white/4 border border-white/8 shrink-0">
										{art.icon}
									</div>
									<div className="min-w-0">
										<h3 className="text-sm sm:text-base font-bold text-zinc-100 truncate sm:whitespace-normal">
											{art.title}
										</h3>
										<p className="text-xs text-zinc-400 mt-0.5 hidden sm:block">{art.summary}</p>
									</div>
								</div>

								<div
									className={`p-1.5 rounded-xl bg-white/4 text-zinc-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-white" : ""}`}
								>
									<ChevronDown size={16} />
								</div>
							</button>

							<AnimatePresence>
								{isOpen && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.2 }}
										className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-zinc-300 border-t border-white/6 pt-3 space-y-2 whitespace-pre-line leading-relaxed"
									>
										{art.content}
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					);
				})}
			</div>
		</section>
	);
});
