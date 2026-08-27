import { Coffee, Heart, MessageCircle, Share2 } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
import type { ThemeConfig } from "@/features/calculator/hooks/useThemes";

type Props = {
	theme: ThemeConfig;
	onOpenPix: () => void;
	onOpenPrivacy?: () => void;
	onOpenTerms?: () => void;
};

export const SiteFooter = memo(function SiteFooter({
	theme,
	onOpenPix,
	onOpenPrivacy,
	onOpenTerms,
}: Props) {
	const handleShareWhatsApp = () => {
		const text = encodeURIComponent(
			"Confira o SmartCalc! A melhor calculadora inteligente para supermercado, comparação de embalagens e divisão de contas: https://smartcalc-navy.vercel.app",
		);
		window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText("https://smartcalc-navy.vercel.app");
		toast.success("Link do SmartCalc copiado!", {
			description: "Compartilhe com seus amigos e familiares.",
			icon: "🔗",
		});
	};

	return (
		<footer className="w-full border-t border-white/8 bg-[#080a0f] text-zinc-400 text-xs py-12 px-4 sm:px-6">
			<div className="max-w-7xl mx-auto space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Coluna 1: Sobre */}
					<div className="space-y-3 md:col-span-2">
						<div className="flex items-center gap-2">
							<img src="/logo.png" alt="SmartCalc" className="w-6 h-6 rounded-lg object-cover" />
							<span className="text-sm font-bold text-white font-display">
								Smart<span className={theme.accentText}>Calc</span>
							</span>
						</div>
						<p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
							A calculadora moderna e intuitiva para o cotidiano brasileiro. Projetada para calcular
							compras, comparar produtos por kg/L, dividir comandas e planejar finanças.
						</p>
						<div className="flex items-center gap-2 pt-1">
							<button
								type="button"
								onClick={handleShareWhatsApp}
								className="p-2 rounded-xl bg-white/4 hover:bg-white/8 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
								title="Compartilhar no WhatsApp"
							>
								<MessageCircle size={14} className="text-emerald-400" />
								<span>WhatsApp</span>
							</button>

							<button
								type="button"
								onClick={handleCopyLink}
								className="p-2 rounded-xl bg-white/4 hover:bg-white/8 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
								title="Copiar Link do Site"
							>
								<Share2 size={14} className="text-cyan-400" />
								<span>Copiar Link</span>
							</button>
						</div>
					</div>

					{/* Coluna 2: Ferramentas */}
					<div className="space-y-2">
						<h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
							Ferramentas
						</h4>
						<ul className="space-y-1.5 text-xs">
							<li>
								<a href="#calculadora" className="hover:text-white transition-colors">
									Calculadora Científica
								</a>
							</li>
							<li>
								<a href="#recursos" className="hover:text-white transition-colors">
									Comparador de Embalagens
								</a>
							</li>
							<li>
								<a href="#recursos" className="hover:text-white transition-colors">
									Divisor de Contas & Gorjeta
								</a>
							</li>
							<li>
								<a href="#recursos" className="hover:text-white transition-colors">
									Simulador de Finanças
								</a>
							</li>
							<li>
								<a href="#recursos" className="hover:text-white transition-colors">
									Conversor de Moedas
								</a>
							</li>
						</ul>
					</div>

					{/* Coluna 3: Links & Apoio */}
					<div className="space-y-2">
						<h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
							Legal & Apoio
						</h4>
						<ul className="space-y-1.5 text-xs">
							<li>
								<button
									type="button"
									onClick={onOpenPrivacy}
									className="hover:text-white transition-colors text-left cursor-pointer"
								>
									Política de Privacidade (LGPD)
								</button>
							</li>
							<li>
								<button
									type="button"
									onClick={onOpenTerms}
									className="hover:text-white transition-colors text-left cursor-pointer"
								>
									Termos de Uso
								</button>
							</li>
							<li>
								<a href="#dicas" className="hover:text-white transition-colors">
									Guia de Economia
								</a>
							</li>
							<li>
								<button
									type="button"
									onClick={onOpenPix}
									className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer pt-1"
								>
									<Coffee size={12} />
									<span>Apoiar com PIX</span>
								</button>
							</li>
						</ul>
					</div>
				</div>

				{/* Linha Inferior */}
				<div className="pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
					<div className="flex flex-wrap items-center gap-3">
						<p>© {new Date().getFullYear()} SmartCalc. Todos os direitos reservados.</p>
						<span className="hidden sm:inline text-zinc-700">•</span>
						<button
							type="button"
							onClick={onOpenPrivacy}
							className="hover:text-zinc-300 transition-colors cursor-pointer"
						>
							Privacidade
						</button>
						<span className="text-zinc-700">•</span>
						<button
							type="button"
							onClick={onOpenTerms}
							className="hover:text-zinc-300 transition-colors cursor-pointer"
						>
							Termos
						</button>
					</div>
					<p className="flex items-center gap-1">
						<span>Desenvolvido com</span>
						<Heart size={12} className="text-rose-500 fill-rose-500" />
						<span>para a Web Brasileira.</span>
					</p>
				</div>
			</div>
		</footer>
	);
});
