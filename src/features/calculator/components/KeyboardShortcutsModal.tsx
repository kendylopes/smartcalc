import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { memo, useEffect } from "react";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

type ShortcutGroup = {
	title: string;
	items: { key: string; desc: string }[];
};

const SHORTCUT_GROUPS: ShortcutGroup[] = [
	{
		title: "Operações Básicas",
		items: [
			{ key: "0 – 9", desc: "Digitar números" },
			{ key: "+  -  *  /", desc: "Operações aritméticas" },
			{ key: "X  ou  x", desc: "Multiplicação rápida" },
			{ key: ".  ou  ,", desc: "Vírgula decimal" },
			{ key: "%", desc: "Porcentagem comercial" },
		],
	},
	{
		title: "Cálculo & Edição",
		items: [
			{ key: "Enter  ou  =", desc: "Calcular resultado" },
			{ key: "Backspace", desc: "Apagar último caractere" },
			{ key: "Escape  ou  C", desc: "Limpar visor (Clear)" },
		],
	},
	{
		title: "Recursos Avançados",
		items: [
			{ key: "Q", desc: "Multiplicador de quantidade (compras)" },
			{ key: "P", desc: "Comparador de embalagens (kg / litro)" },
			{ key: "H", desc: "Abrir Central de Ajuda & Guia de Uso" },
			{ key: "U", desc: "Conversor de moedas e unidades" },
			{ key: "S", desc: "Rachar conta e gorjeta (WhatsApp)" },
			{ key: "F", desc: "Simulador de parcelas e finanças" },
			{ key: "(  )", desc: "Parênteses matemáticos" },
			{ key: "Swipe no Visor", desc: "Deslizar para apagar último dígito" },
			{ key: "Clique no Visor", desc: "Copiar resultado atual" },
			{ key: "Clique no Histórico", desc: "Reutilizar valor em novo cálculo" },
		],
	},
];

export const KeyboardShortcutsModal = memo(function KeyboardShortcutsModal({
	isOpen,
	onClose,
}: Props) {
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
								<div className="p-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
									<Keyboard size={18} />
								</div>
								<div>
									<h2 className="text-base font-semibold text-white tracking-tight">
										Atalhos de Teclado
									</h2>
									<p className="text-[11px] text-zinc-400">
										Navegue e calcule com máxima velocidade
									</p>
								</div>
							</div>

							<button
								type="button"
								onClick={onClose}
								aria-label="Fechar atalhos"
								className="p-1.5 rounded-2xl bg-white/4 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/6 active:scale-95 transition-all outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer"
							>
								<X size={18} />
							</button>
						</div>

						{/* Content */}
						<div className="space-y-3.5 max-h-[60vh] overflow-y-auto py-3 pr-1 scrollbar-none">
							{SHORTCUT_GROUPS.map((group) => (
								<div key={group.title} className="space-y-1.5">
									<h3 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-1">
										{group.title}
									</h3>
									<div className="space-y-1 rounded-2xl bg-zinc-900/60 border border-white/6 p-2">
										{group.items.map((item) => (
											<div
												key={item.key}
												className="flex items-center justify-between py-1 px-1.5 text-xs text-zinc-300"
											>
												<span className="text-zinc-400 text-[11px]">{item.desc}</span>
												<kbd className="px-2 py-0.5 rounded-lg bg-zinc-800 border border-white/10 text-white font-mono text-[11px] shadow-sm">
													{item.key}
												</kbd>
											</div>
										))}
									</div>
								</div>
							))}
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
