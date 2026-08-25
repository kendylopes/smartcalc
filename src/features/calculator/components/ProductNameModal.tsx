import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import type { ThemeConfig } from "../hooks/useThemes";
import { formatNumberPtBR } from "../utils/format";

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
	initialUnitPrice?: string;
	onClose: () => void;
	onConfirm: (unitPrice: string, quantity: number, productName?: string) => void;
	theme?: ThemeConfig;
	onPlayClick?: () => void;
	onPlayConfirm?: () => void;
};

export const ProductNameModal = memo(function ProductNameModal({
	isOpen,
	initialUnitPrice = "",
	onClose,
	onConfirm,
	theme,
	onPlayClick,
	onPlayConfirm,
}: Props) {
	const [productName, setProductName] = useState("");
	const [unitPrice, setUnitPrice] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

	useEffect(() => {
		if (isOpen) {
			const cleanPrice =
				initialUnitPrice && initialUnitPrice !== "0" && initialUnitPrice !== "Error"
					? initialUnitPrice.replace(".", ",")
					: "";
			setUnitPrice(cleanPrice);
			setQuantity(1);
			setProductName("");
			setSelectedCategory("Todos");
		}
	}, [isOpen, initialUnitPrice]);

	// Atalhos de teclado no modal (Enter para confirmar, Escape para fechar)
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			} else if (e.key === "Enter") {
				e.preventDefault();
				handleConfirm();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	});

	// Normaliza valores numéricos para cálculo
	const numericUnitPrice = Number(unitPrice.replace(",", ".")) || 0;
	const subtotal = Math.round(numericUnitPrice * quantity * 100) / 100;

	const categories = useMemo(() => {
		const cats = Array.from(new Set(COMMON_PRODUCTS.map((p) => p.category)));
		return ["Todos", ...cats];
	}, []);

	const filteredProducts = useMemo(() => {
		return COMMON_PRODUCTS.filter((prod) => {
			const matchesCategory = selectedCategory === "Todos" || prod.category === selectedCategory;
			const matchesSearch =
				productName.trim() === "" ||
				prod.name.toLowerCase().includes(productName.toLowerCase()) ||
				prod.category.toLowerCase().includes(productName.toLowerCase());
			return matchesCategory && matchesSearch;
		});
	}, [selectedCategory, productName]);

	const handleIncrement = () => {
		onPlayClick?.();
		setQuantity((prev) => Math.min(prev + 1, 999));
	};

	const handleDecrement = () => {
		onPlayClick?.();
		setQuantity((prev) => Math.max(prev - 1, 1));
	};

	const handleConfirm = () => {
		if (numericUnitPrice <= 0) return;
		onPlayConfirm?.();
		const finalName = productName.trim() || "Sem nome";
		onConfirm(unitPrice, quantity, finalName);
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
							max-h-[92vh]
							flex
							flex-col
						"
					>
						{/* Header */}
						<div className="flex items-center justify-between pb-3 border-b border-white/8 shrink-0">
							<div className="flex items-center gap-2.5">
								<div className="p-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
									<ShoppingBag size={18} />
								</div>
								<div>
									<h2 className="text-sm font-bold text-white tracking-wide">
										Adicionar Item de Supermercado
									</h2>
									<p className="text-[11px] text-zinc-400">
										Escolha o produto, informe o preço e a quantidade
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

						{/* Conteúdo rolável */}
						<div className="space-y-3.5 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-white/10">
							{/* 1. Nome do Produto (Input com busca) */}
							<div className="space-y-1.5">
								<span className="block text-[11px] font-semibold text-zinc-400">
									1. Nome do Produto (opcional):
								</span>
								<div className="relative flex items-center">
									<Search size={14} className="absolute left-3 text-zinc-400 pointer-events-none" />
									<input
										type="text"
										value={productName}
										onChange={(e) => setProductName(e.target.value)}
										placeholder="Ex: Arroz, Feijão, Leite (ou deixe vazio para 'Sem nome')"
										className="
											w-full
											pl-8.5
											pr-8
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
									{productName && (
										<button
											type="button"
											onClick={() => setProductName("")}
											className="absolute right-2.5 p-1 text-zinc-400 hover:text-white cursor-pointer"
										>
											<X size={13} />
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
												py-0.5
												rounded-full
												text-[10px]
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

							{/* Grade Compacta de Sugestões */}
							<div className="max-h-32 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
									{filteredProducts.map((prod) => {
										const isSelected = productName.toLowerCase() === prod.name.toLowerCase();
										return (
											<button
												key={prod.name}
												type="button"
												onClick={() => {
													onPlayClick?.();
													setProductName(prod.name);
												}}
												className={`
													p-2
													rounded-xl
													border
													text-left
													flex
													items-center
													gap-1.5
													transition-all
													cursor-pointer
													active:scale-95
													${
														isSelected
															? "bg-cyan-500/25 border-cyan-500/50 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.25)]"
															: "bg-white/4 border-white/6 hover:border-white/12 hover:bg-white/8 text-zinc-300 hover:text-white"
													}
												`}
											>
												<span className="text-sm select-none">{prod.icon}</span>
												<span className="text-[11px] font-semibold truncate flex-1">
													{prod.name}
												</span>
												{isSelected && <Check size={11} className="text-cyan-400 shrink-0" />}
											</button>
										);
									})}
								</div>
							</div>

							{/* 2. Preço Unitário e Quantidade */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/8">
								{/* Preço Unitário */}
								<div className="space-y-1.5">
									<span className="block text-[11px] font-semibold text-zinc-400">
										2. Preço Unitário (R$):
									</span>
									<div className="relative flex items-center">
										<span className="absolute left-3 text-xs text-zinc-400 font-mono">R$</span>
										<input
											type="text"
											inputMode="decimal"
											value={unitPrice}
											onChange={(e) => setUnitPrice(e.target.value)}
											placeholder="0,00"
											className="
												w-full
												pl-9
												pr-3
												py-2.5
												rounded-2xl
												bg-black/40
												border
												border-white/10
												focus:border-cyan-400
												text-sm
												font-semibold
												text-white
												font-mono
												outline-none
												transition-colors
											"
										/>
									</div>
								</div>

								{/* Quantidade */}
								<div className="space-y-1.5">
									<span className="block text-[11px] font-semibold text-zinc-400">
										3. Quantidade:
									</span>
									<div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10">
										<button
											type="button"
											onClick={handleDecrement}
											className="p-2 rounded-xl bg-white/6 hover:bg-white/12 text-white transition-colors cursor-pointer active:scale-95"
										>
											<Minus size={13} />
										</button>
										<input
											type="number"
											min={1}
											max={999}
											value={quantity}
											onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
											className="w-full text-center bg-transparent text-white font-bold font-mono text-sm outline-none"
										/>
										<button
											type="button"
											onClick={handleIncrement}
											className="p-2 rounded-xl bg-white/6 hover:bg-white/12 text-white transition-colors cursor-pointer active:scale-95"
										>
											<Plus size={13} />
										</button>
									</div>
								</div>
							</div>

							{/* Atalhos Rápidos de Quantidade (1, 2, 3, 4, 5, 6, 10, 12) */}
							<div className="flex items-center gap-1.5 justify-center">
								{[1, 2, 3, 4, 5, 6, 10, 12].map((q) => (
									<button
										key={q}
										type="button"
										onClick={() => {
											onPlayClick?.();
											setQuantity(q);
										}}
										className={`
											px-2
											py-1
											rounded-lg
											text-[10px]
											font-mono
											font-semibold
											transition-all
											cursor-pointer
											${
												quantity === q
													? "bg-cyan-500/25 text-cyan-300 border border-cyan-500/40"
													: "bg-white/4 text-zinc-400 hover:text-white border border-white/6"
											}
										`}
									>
										{q}x
									</button>
								))}
							</div>

							{/* Card de Resumo do Subtotal */}
							<div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
								<div className="space-y-0.5">
									<p className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider font-semibold">
										{productName.trim() || "Item sem nome"}
									</p>
									<p className="text-[11px] text-zinc-400 font-mono">
										{quantity}x R$ {formatNumberPtBR(String(numericUnitPrice || 0))}
									</p>
								</div>
								<div className="text-right">
									<p className="text-[10px] text-zinc-400 uppercase font-mono">Subtotal</p>
									<p className="text-base font-extrabold text-cyan-300 font-mono">
										R$ {formatNumberPtBR(String(subtotal))}
									</p>
								</div>
							</div>
						</div>

						{/* Footer / Confirmar */}
						<div className="pt-2 border-t border-white/8 flex items-center gap-2 shrink-0">
							<button
								type="button"
								onClick={onClose}
								className="
									py-2.5
									px-4
									rounded-2xl
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
								Cancelar
							</button>

							<button
								type="button"
								onClick={handleConfirm}
								disabled={numericUnitPrice <= 0}
								className={`
									flex-1
									py-2.5
									px-4
									rounded-2xl
									flex
									items-center
									justify-center
									gap-2
									text-xs
									font-bold
									transition-all
									cursor-pointer
									active:scale-98
									${
										numericUnitPrice > 0
											? `${theme?.equalBg ?? "bg-cyan-400 text-black"} shadow-[0_0_15px_rgba(6,182,212,0.35)]`
											: "bg-white/10 text-zinc-500 border border-white/8 cursor-not-allowed opacity-60"
									}
								`}
							>
								<span>Adicionar à Conta</span>
								<ArrowRight size={14} />
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});
