import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, Search, Tag, X } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import type { ThemeConfig } from "../hooks/useThemes";

export type ProductPreset = {
	name: string;
	icon: string;
	category: string;
};

export const COMMON_PRODUCTS: ProductPreset[] = [
	// Básicos
	{ name: "Arroz", icon: "🍚", category: "Mercearia" },
	{ name: "Feijão", icon: "🫘", category: "Mercearia" },
	{ name: "Café", icon: "☕", category: "Mercearia" },
	{ name: "Açúcar", icon: "🧂", category: "Mercearia" },
	{ name: "Óleo", icon: "🍾", category: "Mercearia" },
	{ name: "Macarrão", icon: "🍝", category: "Mercearia" },
	{ name: "Molho de Tomate", icon: "🥫", category: "Mercearia" },
	{ name: "Biscoito", icon: "🍪", category: "Mercearia" },

	// Laticínios e Padaria
	{ name: "Leite", icon: "🥛", category: "Laticínios" },
	{ name: "Pão", icon: "🍞", category: "Padaria" },
	{ name: "Queijo", icon: "🧀", category: "Frios" },
	{ name: "Presunto", icon: "🥓", category: "Frios" },
	{ name: "Manteiga", icon: "🧈", category: "Laticínios" },
	{ name: "Ovos", icon: "🥚", category: "Mercearia" },
	{ name: "Iogurte", icon: "🍶", category: "Laticínios" },

	// Açougue
	{ name: "Carne Bovina", icon: "🥩", category: "Açougue" },
	{ name: "Frango", icon: "🍗", category: "Açougue" },
	{ name: "Linguiça", icon: "🌭", category: "Açougue" },
	{ name: "Peixe", icon: "🐟", category: "Açougue" },

	// Hortifrúti
	{ name: "Banana", icon: "🍌", category: "Hortifrúti" },
	{ name: "Maçã", icon: "🍎", category: "Hortifrúti" },
	{ name: "Tomate", icon: "🍅", category: "Hortifrúti" },
	{ name: "Batata", icon: "🥔", category: "Hortifrúti" },
	{ name: "Cebola", icon: "🧅", category: "Hortifrúti" },
	{ name: "Alface", icon: "🥬", category: "Hortifrúti" },

	// Bebidas
	{ name: "Refrigerante", icon: "🥤", category: "Bebidas" },
	{ name: "Suco", icon: "🧃", category: "Bebidas" },
	{ name: "Água", icon: "💧", category: "Bebidas" },
	{ name: "Cerveja", icon: "🍺", category: "Bebidas" },

	// Limpeza e Higiene
	{ name: "Detergente", icon: "🧴", category: "Limpeza" },
	{ name: "Sabão em Pó", icon: "🧼", category: "Limpeza" },
	{ name: "Amaciante", icon: "🧺", category: "Limpeza" },
	{ name: "Papel Higiênico", icon: "🧻", category: "Higiene" },
	{ name: "Shampoo", icon: "🚿", category: "Higiene" },
	{ name: "Pasta de Dente", icon: "🪥", category: "Higiene" },
];

type Props = {
	isOpen: boolean;
	currentProductName?: string;
	onClose: () => void;
	onSelectProduct: (productName: string) => void;
	theme?: ThemeConfig;
	onPlayClick?: () => void;
	onPlayConfirm?: () => void;
};

export const ProductNameModal = memo(function ProductNameModal({
	isOpen,
	currentProductName = "",
	onClose,
	onSelectProduct,
	onPlayClick,
	onPlayConfirm,
}: Props) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

	useEffect(() => {
		if (isOpen) {
			setSearchTerm(currentProductName);
			setSelectedCategory("Todos");
		}
	}, [isOpen, currentProductName]);

	// Atalhos de teclado no modal (Enter para confirmar, Escape para fechar)
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			} else if (e.key === "Enter" && searchTerm.trim()) {
				e.preventDefault();
				handleConfirmCustom();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	});

	const categories = useMemo(() => {
		const cats = Array.from(new Set(COMMON_PRODUCTS.map((p) => p.category)));
		return ["Todos", ...cats];
	}, []);

	const filteredProducts = useMemo(() => {
		return COMMON_PRODUCTS.filter((prod) => {
			const matchesCategory = selectedCategory === "Todos" || prod.category === selectedCategory;
			const matchesSearch =
				searchTerm.trim() === "" ||
				prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				prod.category.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesCategory && matchesSearch;
		});
	}, [selectedCategory, searchTerm]);

	const handleChoose = (name: string) => {
		onPlayConfirm?.();
		onSelectProduct(name);
		onClose();
	};

	const handleConfirmCustom = () => {
		if (!searchTerm.trim()) return;
		onPlayConfirm?.();
		onSelectProduct(searchTerm.trim());
		onClose();
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

					{/* Card Modal */}
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
							space-y-4
						"
					>
						{/* Header */}
						<div className="flex items-center justify-between pb-3 border-b border-white/8">
							<div className="flex items-center gap-2.5">
								<div className="p-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
									<Tag size={18} />
								</div>
								<div>
									<h2 className="text-sm font-bold text-white tracking-wide">Nome do Produto</h2>
									<p className="text-[11px] text-zinc-400">
										Escolha da lista ou digite o nome do item
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

						{/* Campo de Busca / Digitação Livre */}
						<div className="space-y-1.5">
							<div className="relative flex items-center">
								<Search size={15} className="absolute left-3 text-zinc-400 pointer-events-none" />
								<input
									type="text"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									placeholder="Ex: Leite Integral, Arroz 5kg, Pão..."
									className="
										w-full
										pl-9
										pr-24
										py-2.5
										rounded-2xl
										bg-black/40
										border
										border-white/10
										focus:border-cyan-400
										text-xs
										text-white
										placeholder:text-zinc-500
										outline-none
										transition-colors
									"
								/>
								{searchTerm.trim() && (
									<button
										type="button"
										onClick={handleConfirmCustom}
										className="
											absolute
											right-1.5
											px-2.5
											py-1.5
											rounded-xl
											bg-cyan-500/20
											hover:bg-cyan-500/30
											border
											border-cyan-500/30
											text-cyan-300
											text-[11px]
											font-semibold
											flex
											items-center
											gap-1
											cursor-pointer
											transition-colors
										"
									>
										<Check size={12} />
										<span>Usar</span>
									</button>
								)}
							</div>
						</div>

						{/* Categorias em Chips */}
						<div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
							{categories.map((cat) => {
								const isSelected = selectedCategory === cat;
								return (
									<button
										key={cat}
										type="button"
										onClick={() => {
											onPlayClick?.();
											setSelectedCategory(cat);
										}}
										className={`
											px-2.5
											py-1
											rounded-full
											text-[11px]
											font-medium
											whitespace-nowrap
											transition-all
											cursor-pointer
											${
												isSelected
													? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
													: "bg-white/4 text-zinc-400 hover:text-zinc-200 border border-white/6 hover:bg-white/8"
											}
										`}
									>
										{cat}
									</button>
								);
							})}
						</div>

						{/* Grid de Sugestões Rápidas */}
						<div className="max-h-56 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
								{filteredProducts.map((prod) => {
									const isCurrent = currentProductName.toLowerCase() === prod.name.toLowerCase();
									return (
										<button
											key={prod.name}
											type="button"
											onClick={() => handleChoose(prod.name)}
											className={`
												p-2.5
												rounded-2xl
												border
												text-left
												flex
												items-center
												gap-2
												transition-all
												cursor-pointer
												active:scale-95
												${
													isCurrent
														? "bg-cyan-500/20 border-cyan-500/40 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
														: "bg-white/4 border-white/6 hover:border-white/15 hover:bg-white/8 text-zinc-200 hover:text-white"
												}
											`}
										>
											<span className="text-base select-none">{prod.icon}</span>
											<div className="min-w-0 flex-1">
												<p className="text-xs font-semibold truncate leading-tight">{prod.name}</p>
												<p className="text-[10px] text-zinc-500 truncate leading-tight">
													{prod.category}
												</p>
											</div>
										</button>
									);
								})}
							</div>

							{filteredProducts.length === 0 && (
								<div className="py-6 text-center text-xs text-zinc-400 space-y-2">
									<p>Nenhum produto encontrado na lista.</p>
									<button
										type="button"
										onClick={handleConfirmCustom}
										className="
											inline-flex
											items-center
											gap-1.5
											px-3
											py-1.5
											rounded-xl
											bg-cyan-500/20
											border
											border-cyan-500/30
											text-cyan-300
											font-semibold
											text-xs
											cursor-pointer
										"
									>
										<Plus size={13} />
										<span>Usar "{searchTerm}" como nome</span>
									</button>
								</div>
							)}
						</div>

						{/* Footer com Limpar / Fechar */}
						<div className="pt-2 border-t border-white/8 flex items-center justify-between gap-2">
							{currentProductName ? (
								<button
									type="button"
									onClick={() => handleChoose("")}
									className="
										py-2
										px-3
										rounded-xl
										bg-rose-500/10
										hover:bg-rose-500/20
										text-rose-300
										text-xs
										font-medium
										border
										border-rose-500/20
										transition-all
										cursor-pointer
									"
								>
									Remover Nome Ativo
								</button>
							) : (
								<div />
							)}

							<button
								type="button"
								onClick={onClose}
								className="
									py-2
									px-4
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
