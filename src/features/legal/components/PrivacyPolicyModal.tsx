import { AnimatePresence, motion } from "framer-motion";
import { FileText, Lock, ShieldCheck, X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import type { ThemeConfig } from "@/features/calculator/hooks/useThemes";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	initialTab?: "privacy" | "terms";
	theme?: ThemeConfig;
};

export const PrivacyPolicyModal = memo(function PrivacyPolicyModal({
	isOpen,
	onClose,
	initialTab = "privacy",
	theme,
}: Props) {
	const [activeTab, setActiveTab] = useState<"privacy" | "terms">(initialTab);

	useEffect(() => {
		if (isOpen) {
			setActiveTab(initialTab);
		}
	}, [isOpen, initialTab]);

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
						className="absolute inset-0 bg-black/85 backdrop-blur-md"
					/>

					{/* Modal Card */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 15 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 15 }}
						transition={{ type: "spring", stiffness: 350, damping: 25 }}
						className="
							relative
							w-full
							max-w-2xl
							max-h-[85vh]
							overflow-hidden
							rounded-[2.4rem]
							border
							border-white/10
							tech-modal
							p-4 sm:p-6
							shadow-[0_24px_70px_rgba(0,0,0,0.9)]
							flex
							flex-col
						"
					>
						{/* Header */}
						<div className="flex items-center justify-between pb-3.5 border-b border-white/8 shrink-0">
							<div className="flex items-center gap-2.5">
								<div
									className={`
										p-2.5
										rounded-2xl
										${theme?.operatorBgActive ?? "bg-cyan-500/10"}
										border
										${theme?.operatorBorderActive ?? "border-cyan-500/20"}
										${theme?.accentText ?? "text-cyan-400"}
									`}
								>
									<ShieldCheck size={20} />
								</div>
								<div>
									<h2 className="text-base font-bold text-white tracking-tight">
										Privacidade & Termos Legais
									</h2>
									<p className="text-[11px] text-zinc-400">
										Conformidade LGPD & Diretrizes do Google AdSense
									</p>
								</div>
							</div>

							<button
								type="button"
								onClick={onClose}
								aria-label="Fechar termos"
								className="p-1.5 rounded-2xl bg-white/4 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/6 active:scale-95 transition-all outline-none cursor-pointer"
							>
								<X size={18} />
							</button>
						</div>

						{/* Abas */}
						<div className="flex items-center gap-2 pt-3 shrink-0">
							<button
								type="button"
								onClick={() => setActiveTab("privacy")}
								className={`
									flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer
									${
										activeTab === "privacy"
											? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
											: "bg-white/4 text-zinc-400 hover:text-white border border-transparent"
									}
								`}
							>
								<Lock size={13} />
								<span>Política de Privacidade</span>
							</button>
							<button
								type="button"
								onClick={() => setActiveTab("terms")}
								className={`
									flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer
									${
										activeTab === "terms"
											? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
											: "bg-white/4 text-zinc-400 hover:text-white border border-transparent"
									}
								`}
							>
								<FileText size={13} />
								<span>Termos de Uso</span>
							</button>
						</div>

						{/* Conteúdo com scroll */}
						<div className="flex-1 overflow-y-auto py-4 pr-1 text-xs text-zinc-300 space-y-4 custom-scrollbar">
							{activeTab === "privacy" ? (
								<div className="space-y-4 leading-relaxed">
									<div>
										<h3 className="text-sm font-bold text-white mb-1">1. Visão Geral e Compromisso</h3>
										<p className="text-zinc-400">
											O <strong>SmartCalc</strong> respeita a sua privacidade e está comprometido em proteger
											seus dados pessoais em total conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
										</p>
									</div>

									<div>
										<h3 className="text-sm font-bold text-white mb-1">2. Dados Pessoais & Armazenamento Local</h3>
										<p className="text-zinc-400">
											O SmartCalc funciona como uma aplicação estática e PWA. Todos os seus cálculos, listas de
											supermercado, histórico e preferências de temas são armazenados <strong>estritamente no seu próprio navegador
											(via localStorage)</strong>. Nós não coletamos, enviamos nem armazenamos os seus cálculos em servidores remotos.
										</p>
									</div>

									<div>
										<h3 className="text-sm font-bold text-white mb-1">3. Cookies e Tecnologias de Terceiros</h3>
										<p className="text-zinc-400">
											Podemos utilizar serviços de terceiros, como o <strong>Google AdSense</strong> e ferramentas de métricas, que podem utilizar cookies (como o cookie DoubleClick / DART) para exibir anúncios relevantes com base nas suas visitas a este e a outros sites na internet.
										</p>
										<p className="text-zinc-400 mt-1">
											Você pode desativar a personalização de anúncios do Google a qualquer momento acessando as <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">Configurações de Anúncios do Google</a>.
										</p>
									</div>

									<div>
										<h3 className="text-sm font-bold text-white mb-1">4. Direitos do Titular (LGPD)</h3>
										<p className="text-zinc-400">
											Você possui o direito de apagar todos os seus dados a qualquer momento simplesmente limpando os dados do navegador ou utilizando o botão "Limpar Histórico" no aplicativo.
										</p>
									</div>

									<div>
										<h3 className="text-sm font-bold text-white mb-1">5. Alterações nesta Política</h3>
										<p className="text-zinc-400">
											Esta política pode ser atualizada periodicamente para refletir melhorias no app ou novas exigências regulatórias.
										</p>
									</div>
								</div>
							) : (
								<div className="space-y-4 leading-relaxed">
									<div>
										<h3 className="text-sm font-bold text-white mb-1">1. Aceitação dos Termos</h3>
										<p className="text-zinc-400">
											Ao acessar e utilizar o <strong>SmartCalc</strong>, você concorda com estes Termos de Uso e com todas as leis e regulamentos aplicáveis.
										</p>
									</div>

									<div>
										<h3 className="text-sm font-bold text-white mb-1">2. Natureza da Ferramenta</h3>
										<p className="text-zinc-400">
											O SmartCalc é uma ferramenta gratuita desenvolvida para fins de conveniência, produtividade e estimativas rápidas em compras, divisões de conta e planejamento financeiro pessoal.
										</p>
									</div>

									<div>
										<h3 className="text-sm font-bold text-white mb-1">3. Isenção de Responsabilidade Financeira</h3>
										<p className="text-zinc-400">
											Os cálculos de juros compostos, parcelamento (Tabela Price) e comparações de produtos são fornecidos como estimativas indicativas. Decisões de investimento e transações bancárias devem sempre ser validadas junto às suas instituições financeiras.
										</p>
									</div>

									<div>
										<h3 className="text-sm font-bold text-white mb-1">4. Propriedade Intelectual</h3>
										<p className="text-zinc-400">
											Todo o design, interface, código-fonte e elementos visuais pertencem ao projeto SmartCalc, distribuído sob termos de código aberto aplicáveis.
										</p>
									</div>
								</div>
							)}
						</div>

						{/* Footer */}
						<div className="pt-3 border-t border-white/8 shrink-0 flex items-center justify-between">
							<span className="text-[11px] text-zinc-500">Última atualização: Agosto de 2026</span>
							<button
								type="button"
								onClick={onClose}
								className="
									px-4
									py-2
									rounded-xl
									bg-white/6
									hover:bg-white/10
									text-zinc-200
									hover:text-white
									text-xs
									font-medium
									border
									border-white/8
									transition-all
									cursor-pointer
								"
							>
								Fechar
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});
