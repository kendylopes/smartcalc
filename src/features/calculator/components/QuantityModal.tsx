import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Tag, X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import type { ThemeConfig } from "../hooks/useThemes";
import { formatNumberPtBR } from "../utils/format";

type Props = {
	isOpen: boolean;
	initialUnitPrice: string;
	onClose: () => void;
	onConfirm: (unitPrice: string, quantity: number, productName?: string) => void;
	theme?: ThemeConfig;
	onPlayClick?: () => void;
	onPlayConfirm?: () => void;
};

const MARKET_PRODUCT_PRESETS = [
	{ label: "Leite", icon: "🥛" },
	{ label: "Pão", icon: "🍞" },
	{ label: "Café", icon: "☕" },
	{ label: "Arroz", icon: "🍚" },
	{ label: "Carne", icon: "🥩" },
	{ label: "Queijo", icon: "🧀" },
	{ label: "Suco", icon: "🧃" },
	{ label: "Ovos", icon: "🥚" },
	{ label: "Limpeza", icon: "🧼" },
	{ label: "Frutas", icon: "🍎" },
	{ label: "Biscoito", icon: "🍪" },
	{ label: "Macarrão", icon: "🍝" },
];

export const QuantityModal = memo(function QuantityModal({
	isOpen,
	initialUnitPrice,
	onClose,
	onConfirm,
	theme,
	onPlayClick,
	onPlayConfirm,
}: Props) {
	const [productName, setProductName] = useState("");
	const [unitPrice, setUnitPrice] = useState(initialUnitPrice || "0");
	const [quantity, setQuantity] = useState(2);

	// Sincroniza o preço unitário inicial e quantidade quando o modal abre
	useEffect(() => {
		if (isOpen) {
			const cleanPrice =
				initialUnitPrice && initialUnitPrice !== "0" && initialUnitPrice !== "Error"
					? initialUnitPrice.replace(".", ",")
					: "";
			setUnitPrice(cleanPrice);
			setQuantity(2);
			setProductName("");
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

	const handleIncrement = () => {
		onPlayClick?.();
		setQuantity((q) => Math.min(999, q + 1));
	};

	const handleDecrement = () => {
		onPlayClick?.();
		setQuantity((q) => Math.max(1, q - 1));
	};

	const handleProductPresetClick = (preset: { label: string; icon: string }) => {
		onPlayClick?.();
		setProductName(`${preset.icon} ${preset.label}`);
	};

	const handleConfirm = () => {
		onPlayConfirm?.();
		const validQty = Math.max(1, quantity);
		onConfirm(unitPrice, validQty, productName.trim() || undefined);
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

					{/* Card do Modal Padronizado & Compacto */}
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
									<ShoppingBag size={18} />
								</div>
								<div>
									<h2 className="text-base font-semibold text-white tracking-tight">
										Item de Supermercado
									</h2>
									<p className="text-[11px] text-zinc-400">Preço e quantidade do produto</p>
								</div>
							</div>

							<button
								type="button"
								onClick={onClose}
								aria-label="Fechar subtela de quantidade"
								className="p-1.5 rounded-2xl bg-white/4 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/6 active:scale-95 transition-all outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer"
							>
								<X size={18} />
							</button>
						</div>

						{/* Conteúdo do Formulário Simplificado */}
						<div className="space-y-3 py-3">
							{/* Campo 1: Nome do Produto com Chips Rápidos */}
							<div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/8 space-y-1.5">
								<div className="flex items-center justify-between text-xs text-zinc-400">
									<span className="font-medium flex items-center gap-1.5">
										<Tag size={13} /> Nome do Produto (Opcional)
									</span>
									<span className="text-[10px] text-zinc-500">sugestões rápidas</span>
								</div>

								<input
									type="text"
									value={productName}
									onChange={(e) => setProductName(e.target.value)}
									placeholder="Ex: Leite Integral, Café..."
									className="
										w-full
										bg-transparent
										text-base
										font-medium
										text-white
										placeholder:text-zinc-600
										tracking-tight
										outline-none
										border-b
										border-white/15
										focus:border-cyan-400
										pb-1
										transition-colors
									"
								/>

								{/* Chips rápidos de Supermercado */}
								<div className="flex items-center gap-1 overflow-x-auto scrollbar-none pt-0.5">
									{MARKET_PRODUCT_PRESETS.map((p) => (
										<button
											key={p.label}
											type="button"
											onClick={() => handleProductPresetClick(p)}
											className={`
												px-2 py-1 rounded-xl text-[11px] font-medium transition-all active:scale-95 cursor-pointer shrink-0 border
												${
													productName.includes(p.label)
														? `${theme?.accentText ?? "text-cyan-300"} bg-white/15 border-white/20 font-semibold`
														: "text-zinc-400 bg-white/3 border-white/5 hover:text-white hover:bg-white/6"
												}
											`}
										>
											{p.icon} {p.label}
										</button>
									))}
								</div>
							</div>

							{/* CARD UNIFICADO: Preço Unitário + Quantidade Stepper no mesmo container */}
							<div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/8 space-y-2">
								{/* Labels dos dois lados */}
								<div className="flex items-center justify-between text-xs text-zinc-400">
									<span>Preço Unitário</span>
									<span>Quantidade</span>
								</div>

								{/* Linha principal: Input de Preço ✖️ Stepper de Quantidade */}
								<div className="flex items-center justify-between gap-3">
									{/* Lado Esquerdo: Preço Unitário */}
									<div className="flex items-center gap-1.5 flex-1 min-w-0 border-b border-white/15 focus-within:border-cyan-400 pb-0.5 transition-colors">
										<span className="text-lg text-zinc-500 font-light select-none">R$</span>
										<input
											id="unit-price-input"
											type="text"
											inputMode="decimal"
											value={unitPrice}
											onChange={(e) => setUnitPrice(e.target.value.replace(/[^0-9.,]/g, ""))}
											placeholder="0,00"
											className="
												w-full
												bg-transparent
												text-2xl sm:text-3xl
												font-light
												text-white
												tracking-tight
												outline-none
												tabular-nums
											"
											autoFocus
										/>
									</div>

									{/* Divisor Multiplicador */}
									<span className="text-xl text-zinc-600 font-light select-none shrink-0">×</span>

									{/* Lado Direito: Stepper de Quantidade */}
									<div className="flex items-center rounded-xl bg-zinc-800 border border-white/10 p-1 shrink-0">
										<button
											type="button"
											onClick={handleDecrement}
											disabled={quantity <= 1}
											aria-label="Diminuir quantidade"
											className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 active:scale-95 transition-all cursor-pointer"
										>
											<Minus size={14} />
										</button>

										<div className="w-10 text-center text-base font-semibold text-white tabular-nums select-none">
											{quantity}
										</div>

										<button
											type="button"
											onClick={handleIncrement}
											aria-label="Aumentar quantidade"
											className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
										>
											<Plus size={14} />
										</button>
									</div>
								</div>
							</div>

							{/* Card de Resumo do Item */}
							<div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
								<div className="flex items-center justify-between text-xs text-emerald-300">
									<span className="truncate max-w-[60%] font-medium">
										{productName || "Total do Produto"}
									</span>
									<span className="font-mono text-[11px] text-zinc-400 shrink-0">
										{quantity} un × R$ {formatNumberPtBR(unitPrice || "0")}
									</span>
								</div>
								<div className="text-2xl sm:text-3xl font-light text-emerald-400 tracking-tight tabular-nums">
									R$ {formatNumberPtBR(subtotal.toFixed(2))}
								</div>
							</div>
						</div>

						{/* Footer Padronizado */}
						<div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/8">
							<button
								type="button"
								onClick={onClose}
								className="
									w-full
									py-3
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
									active:scale-95
									outline-none
									cursor-pointer
								"
							>
								Cancelar
							</button>

							<button
								type="button"
								onClick={handleConfirm}
								className={`
									w-full
									py-3
									rounded-2xl
									flex
									items-center
									justify-center
									gap-1.5
									${theme?.equalBg ?? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]"}
									text-xs
									font-semibold
									transition-all
									active:scale-95
									outline-none
									cursor-pointer
								`}
							>
								<ArrowRight size={14} />
								<span>Adicionar</span>
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});
