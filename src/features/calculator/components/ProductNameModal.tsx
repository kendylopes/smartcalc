import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Mic, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import type { ThemeConfig } from "../hooks/useThemes";
import { useVoiceInput } from "../hooks/useVoiceInput";
import type { HistoryItem } from "../types/history";
import {
	formatCurrencyInput,
	formatInitialPrice,
	formatNumberPtBR,
	parseCurrencyToNumber,
} from "../utils/format";

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

	// Carnes e Proteínas
	{ name: "Carne Bovina", icon: "🥩", category: "Açougue" },
	{ name: "Frango", icon: "🍗", category: "Açougue" },
	{ name: "Peixe", icon: "🐟", category: "Peixaria" },
	{ name: "Linguiça", icon: "🌭", category: "Açougue" },

	// Hortifruti
	{ name: "Banana", icon: "🍌", category: "Hortifruti" },
	{ name: "Maçã", icon: "🍎", category: "Hortifruti" },
	{ name: "Tomate", icon: "🍅", category: "Hortifruti" },
	{ name: "Batata", icon: "🥔", category: "Hortifruti" },
	{ name: "Cebola", icon: "🧅", category: "Hortifruti" },
	{ name: "Alface", icon: "🥬", category: "Hortifruti" },

	// Bebidas
	{ name: "Água Mineral", icon: "💧", category: "Bebidas" },
	{ name: "Suco", icon: "🧃", category: "Bebidas" },
	{ name: "Refrigerante", icon: "🥤", category: "Bebidas" },
	{ name: "Cerveja", icon: "🍺", category: "Bebidas" },

	// Limpeza e Higiene
	{ name: "Detergente", icon: "🧼", category: "Limpeza" },
	{ name: "Sabão em Pó", icon: "🧺", category: "Limpeza" },
	{ name: "Amaciante", icon: "🧴", category: "Limpeza" },
	{ name: "Papel Higiênico", icon: "🧻", category: "Higiene" },
	{ name: "Sabonete", icon: "🫧", category: "Higiene" },
	{ name: "Creme Dental", icon: "🪥", category: "Higiene" },
];

type Props = {
	isOpen: boolean;
	initialUnitPrice?: string;
	onClose: () => void;
	onConfirm: (unitPrice: string, quantity: number, productName?: string) => void;
	history?: HistoryItem[];
	theme?: ThemeConfig;
	onPlayClick?: () => void;
	onPlayConfirm?: () => void;
};

export const ProductNameModal = memo(function ProductNameModal({
	isOpen,
	initialUnitPrice = "",
	onClose,
	onConfirm,
	history = [],
	theme,
	onPlayClick,
	onPlayConfirm,
}: Props) {
	const [productName, setProductName] = useState("");
	const [unitPrice, setUnitPrice] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
	const [hideInCart, setHideInCart] = useState(true);

	// Detecta os produtos e quantidades já adicionados na conta atual
	const cartItemCounts = useMemo(() => {
		const counts = new Map<string, number>();
		if (!history || !Array.isArray(history)) return counts;
		for (const h of history) {
			const name = h.productName?.toLowerCase().trim();
			if (name && name !== "item" && name !== "sem nome" && name !== "cálculo geral") {
				counts.set(name, (counts.get(name) || 0) + (h.quantity || 1));
			}
		}
		return counts;
	}, [history]);

	// Total de itens sugeridos que já estão no carrinho
	const inCartCount = useMemo(() => {
		let total = 0;
		for (const prod of COMMON_PRODUCTS) {
			if (cartItemCounts.has(prod.name.toLowerCase())) {
				total++;
			}
		}
		return total;
	}, [cartItemCounts]);

	useEffect(() => {
		if (isOpen) {
			const cleanPrice = formatInitialPrice(initialUnitPrice);
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

	// Voz inteligente no modal de produto
	const { isListening: isListeningVoice, toggleListening: toggleVoice } = useVoiceInput({
		onProductRecognized: (name, price, qty) => {
			setProductName(name);
			setUnitPrice(price);
			setQuantity(qty);
			onPlayClick?.();
		},
		onPriceRecognized: (price) => {
			setUnitPrice(price);
			onPlayClick?.();
		},
		onPlaySuccess: onPlayClick,
	});

	// Normaliza valores numéricos para cálculo
	const numericUnitPrice = parseCurrencyToNumber(unitPrice);
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

			const isInCart = cartItemCounts.has(prod.name.toLowerCase());
			// Se o usuário está buscando texto manualmente, mostra tudo. Caso contrário, respeita o toggle hideInCart
			const matchesCartFilter = !hideInCart || !isInCart || productName.trim() !== "";

			return matchesCategory && matchesSearch && matchesCartFilter;
		});
	}, [selectedCategory, productName, hideInCart, cartItemCounts]);

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
							p-4 sm:p-5
							shadow-[0_24px_70px_rgba(0,0,0,0.85)]
							flex
							flex-col
							max-h-[90vh]
						"
					>
						{/* Header */}
						<div className="flex items-center justify-between pb-3 border-b border-white/8">
							<div className="flex items-center gap-2.5">
								<div
									className={`p-2 rounded-2xl ${theme?.operatorBgActive ?? "bg-cyan-500/10"} ${theme?.accentText ?? "text-cyan-400"}`}
								>
									<ShoppingBag size={18} />
								</div>
								<div>
									<h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
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
							{/* 1. Nome do Produto (Input com busca + Botão de Voz) */}
							<div className="space-y-1.5">
								<div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
									<span>1. Nome do Produto (opcional):</span>
									{isListeningVoice && (
										<span className="text-[10px] text-red-300 font-mono animate-pulse">
											🎤 Fale: "2 leites a 4,50"
										</span>
									)}
								</div>
								<div className="flex items-center gap-1.5">
									<div className="relative flex items-center flex-1">
										<Search
											size={14}
											className="absolute left-3 text-zinc-400 pointer-events-none"
										/>
										<input
											type="text"
											value={productName}
											onChange={(e) => setProductName(e.target.value)}
											placeholder="Ex: Arroz, Feijão, Leite..."
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

									<button
										type="button"
										onClick={toggleVoice}
										title={
											isListeningVoice
												? "Parar de ouvir"
												: "Falar item por voz (ex: '2 leites a 4,50')"
										}
										className={`
											p-2.5
											rounded-2xl
											border
											transition-all
											cursor-pointer
											shrink-0
											flex
											items-center
											justify-center
											active:scale-95
											${
												isListeningVoice
													? "bg-red-500/25 text-red-300 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.35)] animate-pulse"
													: "bg-white/5 text-zinc-400 border-white/10 hover:text-white hover:bg-white/10"
											}
										`}
									>
										<Mic
											size={15}
											className={isListeningVoice ? "text-red-400 animate-bounce" : ""}
										/>
									</button>
								</div>
							</div>

							{/* Categorias em Chips com rolagem suave */}
							<div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none scroll-smooth">
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
												px-3
												py-1
												rounded-full
												text-[11px]
												font-semibold
												whitespace-nowrap
												transition-all
												cursor-pointer
												active:scale-95
												${
													isSelected
														? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
														: "bg-white/4 text-zinc-400 hover:text-zinc-200 border border-white/6 hover:bg-white/8"
												}
											`}
										>
											{cat}
										</button>
									);
								})}
							</div>

							{/* Indicador de Itens Ocultados do Carrinho */}
							{inCartCount > 0 && productName.trim() === "" && (
								<div className="flex items-center justify-between px-1 text-[11px] text-zinc-400 select-none">
									<span className="flex items-center gap-1.5">
										<span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
										{hideInCart
											? `${inCartCount} ${inCartCount === 1 ? "item já no carrinho ocultado" : "itens já no carrinho ocultados"}`
											: "Mostrando todos os itens"}
									</span>
									<button
										type="button"
										onClick={() => setHideInCart((prev) => !prev)}
										className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline cursor-pointer"
									>
										{hideInCart ? "Mostrar todos" : "Ocultar adicionados"}
									</button>
								</div>
							)}

							{/* Sugestões em Chips Fluídos (Flex Wrap) — ZERO corte de texto */}
							<div className="max-h-34 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
								<div className="flex flex-wrap gap-1.5">
									{filteredProducts.map((prod) => {
										const isSelected = productName.toLowerCase() === prod.name.toLowerCase();
										const inCartQty = cartItemCounts.get(prod.name.toLowerCase()) || 0;
										const isInCart = inCartQty > 0;

										return (
											<button
												key={prod.name}
												type="button"
												onClick={() => {
													onPlayClick?.();
													setProductName(prod.name);
												}}
												className={`
													px-2.5
													py-1.5
													rounded-xl
													border
													text-left
													flex
													items-center
													gap-1.5
													transition-all
													cursor-pointer
													whitespace-nowrap
													shrink-0
													active:scale-95
													${
														isSelected
															? "bg-cyan-500/25 border-cyan-500/50 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/40"
															: isInCart
																? "bg-white/2 border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/15"
																: "bg-white/4 border-white/6 hover:border-white/15 hover:bg-white/8 text-zinc-300 hover:text-white"
													}
												`}
											>
												<span className="text-sm select-none">{prod.icon}</span>
												<span className="text-xs font-semibold">{prod.name}</span>
												{isInCart && (
													<span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/6 text-zinc-400 font-mono">
														{inCartQty}x
													</span>
												)}
												{isSelected && <Check size={12} className="text-cyan-400 shrink-0" />}
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
											inputMode="numeric"
											value={unitPrice}
											onChange={(e) => setUnitPrice(formatCurrencyInput(e.target.value))}
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
