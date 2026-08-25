import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
	Check,
	Coffee,
	Copy,
	Heart,
	X,
} from "lucide-react";
import { toast } from "sonner";
import type { ThemeConfig } from "@/features/calculator/hooks/useThemes";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	theme?: ThemeConfig;
};

// Chave PIX padrão (pode ser configurada pelo criador)
const PIX_KEY = "kennedy.dev.calc@gmail.com";

export const PixDonationModal = memo(function PixDonationModal({
	isOpen,
	onClose,
	theme,
}: Props) {
	const [copied, setCopied] = useState(false);

	const handleCopyPix = () => {
		navigator.clipboard.writeText(PIX_KEY);
		setCopied(true);
		toast.success("Chave PIX copiada com sucesso!", {
			description: "Cole no seu aplicativo de banco para apoiar o projeto.",
			icon: "☕",
		});
		setTimeout(() => setCopied(false), 2500);
	};

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

					{/* Modal Card */}
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
							p-4.5 sm:p-6
							shadow-[0_24px_70px_rgba(0,0,0,0.85)]
						"
					>
						{/* Header */}
						<div className="flex items-center justify-between pb-3 border-b border-white/8">
							<div className="flex items-center gap-2.5">
								<div className="p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
									<Coffee size={18} />
								</div>
								<div>
									<h2 className="text-sm font-bold text-white tracking-wide">
										Apoie o Projeto SmartCalc
									</h2>
									<p className="text-[11px] text-zinc-400">
										Pague um cafezinho para o desenvolvedor
									</p>
								</div>
							</div>

							<button
								type="button"
								onClick={onClose}
								className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
							>
								<X size={16} />
							</button>
						</div>

						{/* Conteúdo */}
						<div className="py-4 space-y-4 text-center">
							<div className="p-4 rounded-2xl bg-white/4 border border-white/8 space-y-2">
								<div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 mb-1">
									<Heart size={24} className="animate-pulse" />
								</div>
								<p className="text-xs text-zinc-300 leading-relaxed">
									O <strong>SmartCalc</strong> é um projeto independente, 100% gratuito e sem anúncios invasivos.
									Sua contribuição de qualquer valor (R$ 2, R$ 5 ou R$ 10) ajuda a manter os servidores ativos e novas atualizações constantes!
								</p>
							</div>

							{/* Campo Chave PIX */}
							<div className="space-y-1.5 text-left">
								<label className="text-[11px] font-semibold text-zinc-400">
									Chave PIX (E-mail):
								</label>
								<div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-cyan-300">
									<span className="truncate flex-1 px-1">{PIX_KEY}</span>
									<button
										type="button"
										onClick={handleCopyPix}
										className="
											p-2
											rounded-lg
											bg-white/8
											hover:bg-white/12
											text-white
											flex
											items-center
											gap-1.5
											text-xs
											font-sans
											font-semibold
											cursor-pointer
											transition-colors
											shrink-0
										"
									>
										{copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
										<span>{copied ? "Copiado!" : "Copiar"}</span>
									</button>
								</div>
							</div>

							{/* Botão de Cópia Principal */}
							<button
								type="button"
								onClick={handleCopyPix}
								className={`
									w-full
									py-3
									rounded-2xl
									flex
									items-center
									justify-center
									gap-2
									text-xs
									font-semibold
									${theme?.equalBg ?? "bg-cyan-400 text-black"}
									active:scale-98
									transition-all
									cursor-pointer
								`}
							>
								{copied ? <Check size={14} /> : <Copy size={14} />}
								<span>{copied ? "Chave PIX Copiada!" : "Copiar Chave PIX"}</span>
							</button>
						</div>

						{/* Footer */}
						<div className="pt-3 border-t border-white/8">
							<button
								type="button"
								onClick={onClose}
								className="
									w-full
									py-2.5
									rounded-xl
									bg-white/6
									hover:bg-white/10
									text-zinc-300
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
