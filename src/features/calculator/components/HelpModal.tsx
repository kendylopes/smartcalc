import { AnimatePresence, motion } from "framer-motion";
import {
	BarChart3,
	BookOpen,
	ChevronDown,
	Fuel,
	Globe,
	Lightbulb,
	Mic,
	Scale,
	ScanBarcode,
	ShoppingBag,
	Smartphone,
	Tag,
	Target,
	TrendingUp,
	Utensils,
	X,
} from "lucide-react";
import { memo, useEffect, useState } from "react";
import type { ThemeConfig } from "../hooks/useThemes";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	theme?: ThemeConfig;
};

type HelpSection = {
	id: string;
	title: string;
	icon: any;
	color: string;
	badge?: string;
	summary: string;
	steps: { title: string; desc: string }[];
	tip?: string;
};

const HELP_SECTIONS: HelpSection[] = [
	{
		id: "scanner",
		title: "Leitor de Código de Barras (Câmera)",
		icon: ScanBarcode,
		color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
		badge: "Novo",
		summary: "Aponte a câmera do celular para o código de barras das embalagens para adicionar produtos instantaneamente.",
		steps: [
			{
				title: "1. Abrir o Scanner",
				desc: "Pressione a tecla B, clique no botão 'Scan' no topo do visor ou no Menu Hambúrguer.",
			},
			{
				title: "2. Apontar a Câmera para o Código",
				desc: "Enquadre o código de barras (EAN-13, EAN-8, QR Code). O app emitirá um bipe sonoro e identificará o produto.",
			},
			{
				title: "3. Confirmar Preço e Quantidade",
				desc: "Ajuste o valor e as unidades se necessário e clique em 'Adicionar à Conta'.",
			},
			{
				title: "4. Modo Mercado Contínuo",
				desc: "Clique em 'Escanear Próximo' para ir bipando item por item no supermercado sem fechar o modal.",
			},
		],
		tip: "Use o botão de Lanterna (Torch) para ler embalagens no escuro e o botão de inverter câmera frontal/traseira.",
	},
	{
		id: "supermarket",
		title: "Compras de Supermercado & Carrinho",
		icon: ShoppingBag,
		color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
		badge: "Mais Usado",
		summary: "Some os produtos no mercado com nome, quantidade e valor já calculado no visor.",
		steps: [
			{
				title: "1. Adicionar Produto",
				desc: "Digite o preço unitário e clique no botão 'Quantidade' (ou aperte a tecla Q).",
			},
			{
				title: "2. Atalhos Rápidos de 1-Toque",
				desc: "Toque nas sugestões de mercado (🥛 Leite, 🍞 Pão, ☕ Café, 🥩 Carne...) para nomear o item sem precisar digitar.",
			},
			{
				title: "3. Ajuste de Quantidade",
				desc: "Use os botões [+] e [-] para definir quantas unidades está levando e clique em 'Adicionar'.",
			},
			{
				title: "4. Cupom no WhatsApp",
				desc: "No topo do Histórico, clique no ícone de Download e selecione 'Cupom WhatsApp' para mandar a lista formatada com a soma total.",
			},
		],
		tip: "O visor recebe diretamente a soma limpa dos itens, enquanto o painel lateral guarda o cupom detalhado.",
	},
	{
		id: "analytics",
		title: "Dashboard de Estatísticas & Gráficos",
		icon: BarChart3,
		color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
		badge: "Novo",
		summary: "Análise visual de gastos, média por item e ranking dos produtos mais caros.",
		steps: [
			{
				title: "1. Acessar o Dashboard",
				desc: "Pressione a tecla G ou clique em 'Estatísticas & Gráficos' no menu do Histórico.",
			},
			{
				title: "2. Indicadores Principais (KPIs)",
				desc: "Visualize o Total Gasto, Média por Item, Quantidade de Produtos e Maior Despesa.",
			},
			{
				title: "3. Ranking de Impacto (%)",
				desc: "Veja barras animadas mostrando qual porcentagem cada produto consumiu do valor total.",
			},
		],
		tip: "Clique em 'Copiar Relatório' para gerar um resumo financeiro pronto para anotações.",
	},
	{
		id: "comparator",
		title: "Comparador de Embalagens (kg / Litro)",
		icon: Scale,
		color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
		summary:
			"Descubra qual tamanho de produto é mais vantajoso por quilo ou litro e evite pegadinhas.",
		steps: [
			{
				title: "1. Abrir o Comparador",
				desc: "Abra pelo Menu Hambúrguer ou pressione a tecla P.",
			},
			{
				title: "2. Preencher a Opção A e B",
				desc: "Insira o preço e o peso/volume de cada embalagem (ex: 250g por R$ 3,50 vs 500g por R$ 7,99).",
			},
			{
				title: "3. Ver o Veredito de Economia",
				desc: "O app calcula o custo por kg/litro de ambas e diz na hora qual é mais barata e a porcentagem economizada.",
			},
			{
				title: "4. Usar Vencedor",
				desc: "Clique em 'Usar Vencedor' para transferir o melhor preço direto para a conta da calculadora.",
			},
		],
		tip: "Suporta gramas (g), quilos (kg), mililitros (ml), litros (L) e unidades (un).",
	},
	{
		id: "fuel",
		title: "Calculadora Flex (Etanol vs Gasolina)",
		icon: Fuel,
		color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
		badge: "Novo",
		summary: "Descubra na hora qual combustível compensa mais no posto de gasolina.",
		steps: [
			{
				title: "1. Inserir Preços na Bomba",
				desc: "Digite o valor por litro do Etanol e da Gasolina.",
			},
			{
				title: "2. Análise da Paridade (70%)",
				desc: "O algoritmo verifica a razão de eficiência energética e aponta a opção mais vantajosa.",
			},
			{
				title: "3. Economia por Tanque",
				desc: "Veja a projeção de economia em Reais para um abastecimento completo de 50 litros.",
			},
		],
		tip: "Pode ser acessado pelo menu ou pelo atalho rápido no modo Studio.",
	},
	{
		id: "discount",
		title: "Descontos & Margem de Lucro (Markup)",
		icon: Tag,
		color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
		badge: "Novo",
		summary: "Calcule preços com desconto % OFF ou precifique produtos com margem de lucro markup.",
		steps: [
			{
				title: "Aba Descontos (% OFF)",
				desc: "Insira o valor original e a porcentagem de desconto para saber o preço final e a economia.",
			},
			{
				title: "Aba Lucro & Margem",
				desc: "Insira o custo de compra e a margem de lucro almejada para calcular o preço de venda ideal.",
			},
		],
	},
	{
		id: "voice",
		title: "Falar para Somar (Reconhecimento de Voz)",
		icon: Mic,
		color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
		badge: "Novo",
		summary: "Fale expressões matemáticas ou produtos e o app digita para você.",
		steps: [
			{
				title: "1. Ativar o Microfone",
				desc: "Clique no ícone de microfone no topo do visor da calculadora.",
			},
			{
				title: "2. Falar Naturalmente",
				desc: "Exemplos: 'Cinquenta mais trinta e cinco' ou 'Dois leites a quatro reais'.",
			},
		],
		tip: "Funciona direto no navegador Chrome, Safari, Edge e dispositivos móveis.",
	},
	{
		id: "i18n",
		title: "Multi-Idioma & Moedas Internacionais",
		icon: Globe,
		color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
		badge: "Novo",
		summary: "Alterne instantaneamente o idioma e a moeda entre Português, Inglês e Espanhol.",
		steps: [
			{
				title: "1. Seleção no Menu",
				desc: "Abra o Menu Hambúrguer e escolha seu idioma: Português (R$), English ($) ou Español (€).",
			},
			{
				title: "2. Formatação Automática",
				desc: "Separadores decimais e moedas se adaptam automaticamente ao padrão internacional.",
			},
		],
	},
	{
		id: "budget",
		title: "Meta de Gastos & Limite de Orçamento",
		icon: Target,
		color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
		summary:
			"Defina um teto de dinheiro para a compra e acompanhe a barra de progresso em tempo real.",
		steps: [
			{
				title: "1. Definir Meta",
				desc: "No topo do Histórico, clique em 'Definir meta de gastos' e digite seu limite (ex: R$ 150,00).",
			},
			{
				title: "2. Barra de Progresso Inteligente",
				desc: "Verde (< 80%), Âmbar (80% a 99% - Atenção) e Vermelho (100% - Limite ultrapassado com o valor excedido).",
			},
		],
		tip: "Você pode alterar ou excluir a meta a qualquer momento clicando no ícone de lápis.",
	},
	{
		id: "split-bill",
		title: "Rachar Conta & Gorjeta",
		icon: Utensils,
		color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
		summary:
			"Divida contas de bares e restaurantes com taxa de serviço e envie nos grupos de WhatsApp.",
		steps: [
			{
				title: "1. Abrir Divisor",
				desc: "Abra pelo Menu Hambúrguer ou aperte a tecla S.",
			},
			{
				title: "2. Selecionar Pessoas e Taxa",
				desc: "Defina a quantidade de amigos (1 a 30) e a gorjeta (0%, 10%, 12%, 15%...).",
			},
			{
				title: "3. Copiar para o WhatsApp",
				desc: "Clique no botão 'Copiar para o WhatsApp' para colar uma mensagem com os dados no grupo de amigos.",
			},
		],
	},
	{
		id: "finance",
		title: "Simulador Financeiro & Juros",
		icon: TrendingUp,
		color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
		summary:
			"Calcule o valor exato de parcelas pela Tabela Price e simule patrimônio com juros compostos.",
		steps: [
			{
				title: "Aba 1 (Parcelamento)",
				desc: "Veja o valor de cada parcela, o total pago no final e quanto pagou só de juros embutidos.",
			},
			{
				title: "Aba 2 (Investimentos)",
				desc: "Projete aportes mensais e veja quanto seu dinheiro rende em 1, 2, 5, 10 ou 20 anos.",
			},
		],
	},
	{
		id: "gestures",
		title: "Gestos & Dicas Rápidas no Celular",
		icon: Smartphone,
		color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
		summary: "Pequenos truques para usar o aplicativo com máxima agilidade no dia a dia.",
		steps: [
			{
				title: "👆 Swipe to Delete",
				desc: "Deslize o dedo para a esquerda no visor da calculadora para apagar o último número.",
			},
			{
				title: "📋 Clique no Visor para Copiar",
				desc: "Toque em qualquer lugar do visor para copiar o resultado para a área de transferência.",
			},
			{
				title: "🔆 Manter Tela Acesa (Wake Lock)",
				desc: "No Menu Hambúrguer, ative 'Tela Sempre Acesa' para que o celular não apague enquanto você empurra o carrinho.",
			},
			{
				title: "📱 Instalação PWA",
				desc: "Clique em 'Instalar Aplicativo' no menu para adicionar o SmartCalc à tela inicial do celular como um app nativo.",
			},
		],
	},
];

export const HelpModal = memo(function HelpModal({ isOpen, onClose, theme }: Props) {
	const [expandedSection, setExpandedSection] = useState<string>("supermarket");

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
									<BookOpen size={18} />
								</div>
								<div>
									<h2 className="text-base font-semibold text-white tracking-tight">
										Central de Ajuda
									</h2>
									<p className="text-[11px] text-zinc-400">Guia prático e recursos da SmartCalc</p>
								</div>
							</div>

							<button
								type="button"
								onClick={onClose}
								aria-label="Fechar ajuda"
								className="p-1.5 rounded-2xl bg-white/4 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/6 active:scale-95 transition-all outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer"
							>
								<X size={18} />
							</button>
						</div>

						{/* Acordeão de Tópicos com Scroll Contido */}
						<div className="space-y-2 max-h-[60vh] overflow-y-auto py-3 pr-0.5 scrollbar-none">
							{HELP_SECTIONS.map((sec) => {
								const isExpanded = expandedSection === sec.id;
								const Icon = sec.icon;

								return (
									<div
										key={sec.id}
										className="rounded-2xl bg-zinc-900/60 border border-white/6 overflow-hidden transition-all duration-150"
									>
										{/* Cabeçalho do Tópico (Clique para expandir) */}
										<button
											type="button"
											onClick={() => setExpandedSection(isExpanded ? "" : sec.id)}
											className="w-full flex items-center justify-between p-3 text-left transition-colors hover:bg-white/4 cursor-pointer outline-none"
										>
											<div className="flex items-center gap-2.5 min-w-0">
												<div className={`p-1.5 rounded-xl border shrink-0 ${sec.color}`}>
													<Icon size={14} />
												</div>
												<div className="min-w-0">
													<div className="flex items-center gap-1.5">
														<span className="text-xs font-semibold text-white tracking-tight truncate">
															{sec.title}
														</span>
														{sec.badge && (
															<span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
																{sec.badge}
															</span>
														)}
													</div>
													<p className="text-[10px] text-zinc-400 truncate mt-0.5">{sec.summary}</p>
												</div>
											</div>

											<motion.div
												animate={{ rotate: isExpanded ? 180 : 0 }}
												transition={{ duration: 0.15 }}
												className="text-zinc-500 shrink-0 ml-1"
											>
												<ChevronDown size={16} />
											</motion.div>
										</button>

										{/* Conteúdo Expandido do Tópico */}
										<AnimatePresence>
											{isExpanded && (
												<motion.div
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 1 }}
													exit={{ height: 0, opacity: 0 }}
													transition={{ duration: 0.2 }}
													className="px-3.5 pb-3.5 pt-1 border-t border-white/6 space-y-2.5"
												>
													<div className="space-y-2">
														{sec.steps.map((step, idx) => (
															<div key={idx} className="text-xs space-y-0.5">
																<p className="font-semibold text-zinc-200 text-[11px]">
																	{step.title}
																</p>
																<p className="text-[11px] text-zinc-400 leading-relaxed">
																	{step.desc}
																</p>
															</div>
														))}
													</div>

													{sec.tip && (
														<div className="flex items-start gap-1.5 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] leading-normal">
															<Lightbulb size={12} className="shrink-0 mt-0.5 text-cyan-400" />
															<span>
																<strong>Dica:</strong> {sec.tip}
															</span>
														</div>
													)}
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								);
							})}
						</div>

						{/* Footer Padronizado */}
						<div className="pt-3 border-t border-white/8">
							<button
								type="button"
								onClick={onClose}
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
									transition-all
									active:scale-95
									outline-none
									cursor-pointer
								"
							>
								Entendi, fechar
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});
