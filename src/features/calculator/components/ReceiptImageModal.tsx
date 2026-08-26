import { AnimatePresence, motion } from "framer-motion";
import { Download, Receipt, Share2, Sparkles, X } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ThemeConfig } from "../hooks/useThemes";
import type { HistoryItem } from "../types";
import { formatNumberPtBR } from "../utils/format";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	history: HistoryItem[];
	theme?: ThemeConfig;
	onPlayClick?: () => void;
};

export const ReceiptImageModal = memo(function ReceiptImageModal({
	isOpen,
	onClose,
	history,
	theme,
	onPlayClick,
}: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(true);

	const totalAmount = history.reduce((acc, item) => acc + (Number(item.result) || 0), 0);
	const totalItemsCount = history.reduce((acc, item) => acc + (item.quantity || 1), 0);

	// Desenha o cupom estilizado no Canvas
	const generateReceipt = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Configurações de layout
		const width = 640;
		const rowHeight = 36;
		const baseHeaderHeight = 220;
		const footerHeight = 180;
		const itemsHeight = Math.max(1, history.length) * rowHeight;
		const height = baseHeaderHeight + itemsHeight + footerHeight;

		canvas.width = width;
		canvas.height = height;

		// 1. Fundo Dark Glass / Papel Térmico Moderno
		const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
		bgGrad.addColorStop(0, "#0e111a");
		bgGrad.addColorStop(0.5, "#0b0d14");
		bgGrad.addColorStop(1, "#07080d");
		ctx.fillStyle = bgGrad;
		ctx.fillRect(0, 0, width, height);

		// Borda neon externa
		ctx.strokeStyle = "rgba(34, 211, 238, 0.25)";
		ctx.lineWidth = 4;
		ctx.strokeRect(12, 12, width - 24, height - 24);

		// 2. Cabeçalho do Cupom
		ctx.fillStyle = "#22d3ee";
		ctx.font = "bold 24px monospace";
		ctx.textAlign = "center";
		ctx.fillText("🛍️ SMARTCALC", width / 2, 55);

		ctx.fillStyle = "#a1a1aa";
		ctx.font = "13px monospace";
		ctx.fillText("EXTRATO INTELIGENTE DE COMPRAS", width / 2, 80);

		const now = new Date();
		const dateStr = now.toLocaleDateString("pt-BR", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
		const timeStr = now.toLocaleTimeString("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
		});
		ctx.fillStyle = "#71717a";
		ctx.font = "12px monospace";
		ctx.fillText(`EMISSÃO: ${dateStr} ÀS ${timeStr}`, width / 2, 105);

		// Linha divisória serrilhada / tracejada
		ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
		ctx.lineWidth = 2;
		ctx.setLineDash([6, 4]);
		ctx.beginPath();
		ctx.moveTo(32, 130);
		ctx.lineTo(width - 32, 130);
		ctx.stroke();

		// Cabeçalho da Tabela
		ctx.setLineDash([]);
		ctx.fillStyle = "#38bdf8";
		ctx.font = "bold 13px monospace";
		ctx.textAlign = "left";
		ctx.fillText("ITEM / PRODUTO", 36, 160);
		ctx.textAlign = "center";
		ctx.fillText("QTD", 360, 160);
		ctx.textAlign = "right";
		ctx.fillText("TOTAL (R$)", width - 36, 160);

		// Linha divisória contínua
		ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
		ctx.beginPath();
		ctx.moveTo(32, 175);
		ctx.lineTo(width - 32, 175);
		ctx.stroke();

		// 3. Linhas dos Itens
		let yPos = 210;
		if (history.length === 0) {
			ctx.fillStyle = "#71717a";
			ctx.font = "italic 13px monospace";
			ctx.textAlign = "center";
			ctx.fillText("Nenhum item registrado no momento", width / 2, yPos);
			yPos += 30;
		} else {
			history.forEach((item, index) => {
				const isEven = index % 2 === 0;
				if (isEven) {
					ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
					ctx.fillRect(32, yPos - 22, width - 64, rowHeight);
				}

				// Nome do produto
				const name = item.productName || item.tag || `Cálculo #${history.length - index}`;
				const cleanName = name.length > 24 ? `${name.substring(0, 22)}...` : name;

				ctx.fillStyle = "#f4f4f5";
				ctx.font = "13px monospace";
				ctx.textAlign = "left";
				ctx.fillText(cleanName, 36, yPos);

				// Quantidade
				ctx.fillStyle = "#a1a1aa";
				ctx.textAlign = "center";
				ctx.fillText(`${item.quantity || 1}x`, 360, yPos);

				// Preço Total do item
				const itemTotal = Number(item.result) || 0;
				ctx.fillStyle = "#34d399";
				ctx.font = "bold 13px monospace";
				ctx.textAlign = "right";
				ctx.fillText(formatNumberPtBR(itemTotal.toFixed(2)), width - 36, yPos);

				yPos += rowHeight;
			});
		}

		// Linha divisória antes dos totais
		ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
		ctx.setLineDash([6, 4]);
		ctx.beginPath();
		ctx.moveTo(32, yPos + 10);
		ctx.lineTo(width - 32, yPos + 10);
		ctx.stroke();
		ctx.setLineDash([]);

		// 4. Totais e Resumo
		const summaryY = yPos + 40;
		ctx.fillStyle = "#a1a1aa";
		ctx.font = "13px monospace";
		ctx.textAlign = "left";
		ctx.fillText(`TOTAL DE ITENS: ${totalItemsCount} un`, 36, summaryY);

		ctx.fillStyle = "#22d3ee";
		ctx.font = "bold 22px monospace";
		ctx.textAlign = "left";
		ctx.fillText("VALOR TOTAL:", 36, summaryY + 38);

		ctx.fillStyle = "#34d399";
		ctx.font = "bold 26px monospace";
		ctx.textAlign = "right";
		ctx.fillText(`R$ ${formatNumberPtBR(totalAmount.toFixed(2))}`, width - 36, summaryY + 38);

		// 5. Rodapé
		const footerY = summaryY + 80;
		ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
		ctx.beginPath();
		ctx.moveTo(32, footerY);
		ctx.lineTo(width - 32, footerY);
		ctx.stroke();

		ctx.fillStyle = "#52525b";
		ctx.font = "11px monospace";
		ctx.textAlign = "center";
		ctx.fillText("✨ CALCULADO COM SMARTCALC", width / 2, footerY + 25);
		ctx.fillText("Calculadora Inteligente de Supermercado & Finanças", width / 2, footerY + 42);

		// Converte para URL de imagem PNG
		const dataUrl = canvas.toDataURL("image/png");
		setImageUrl(dataUrl);
		setIsGenerating(false);
	}, [history, totalAmount, totalItemsCount]);

	useEffect(() => {
		if (isOpen) {
			setIsGenerating(true);
			setTimeout(() => {
				generateReceipt();
			}, 100);
		}
	}, [isOpen, generateReceipt]);

	// Download da Imagem PNG
	const handleDownload = () => {
		if (!imageUrl) return;
		onPlayClick?.();
		const link = document.createElement("a");
		link.download = `smartcalc-recibo-${Date.now()}.png`;
		link.href = imageUrl;
		link.click();
		toast.success("Cupom em imagem salvo na galeria/downloads!", {
			icon: "📥",
		});
	};

	// Compartilhamento Direto
	const handleShare = async () => {
		onPlayClick?.();
		if (!canvasRef.current) return;

		canvasRef.current.toBlob(async (blob) => {
			if (!blob) return;
			const file = new File([blob], "smartcalc-cupom.png", { type: "image/png" });

			if (navigator.canShare && navigator.canShare({ files: [file] })) {
				try {
					await navigator.share({
						title: "SmartCalc — Cupom de Compras",
						text: `🛒 Extrato de Compras: R$ ${formatNumberPtBR(totalAmount.toFixed(2))}`,
						files: [file],
					});
					toast.success("Compartilhado com sucesso!");
				} catch {
					// Usuário cancelou
				}
			} else {
				handleDownload();
			}
		});
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
						className="absolute inset-0 bg-black/85 backdrop-blur-md"
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
							max-w-lg
							overflow-hidden
							rounded-[2.2rem]
							border
							border-white/10
							bg-[#0d0f17]/95
							p-5
							shadow-2xl
							tech-modal
							flex
							flex-col
							max-h-[92vh]
						"
					>
						{/* Header */}
						<div className="flex items-center justify-between pb-3 border-b border-white/8">
							<div className="flex items-center gap-2.5">
								<div
									className={`p-2 rounded-2xl ${theme?.operatorBgActive ?? "bg-cyan-500/10"} ${theme?.accentText ?? "text-cyan-400"}`}
								>
									<Receipt size={18} />
								</div>
								<div>
									<h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
										Cupom Fiscal Digital (Imagem)
									</h3>
									<p className="text-[11px] text-zinc-400">
										Gere e compartilhe seu recibo em PNG em alta definição
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

						{/* Canvas Oculto para renderização */}
						<canvas ref={canvasRef} className="hidden" />

						{/* Pré-visualização da Imagem */}
						<div className="flex-1 overflow-y-auto py-3 flex items-center justify-center min-h-64">
							{isGenerating || !imageUrl ? (
								<div className="flex flex-col items-center gap-2 text-zinc-400 py-12">
									<Sparkles size={24} className="text-cyan-400 animate-spin" />
									<span className="text-xs font-mono">Renderizando cupom em alta resolução...</span>
								</div>
							) : (
								<div className="relative group max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/15">
									<img
										src={imageUrl}
										alt="Cupom de Compras SmartCalc"
										className="w-full h-auto object-contain max-h-[55vh] select-none"
									/>
								</div>
							)}
						</div>

						{/* Botões de Ação */}
						<div className="pt-3 border-t border-white/8 grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={handleDownload}
								className="
									py-2.5
									px-4
									rounded-2xl
									bg-white/4
									hover:bg-white/8
									border
									border-white/10
									text-zinc-200
									hover:text-white
									text-xs
									font-semibold
									flex
									items-center
									justify-center
									gap-2
									transition-all
									cursor-pointer
									active:scale-95
								"
							>
								<Download size={14} className="text-cyan-400" />
								<span>Baixar PNG</span>
							</button>

							<button
								type="button"
								onClick={handleShare}
								className="
									py-2.5
									px-4
									rounded-2xl
									bg-cyan-500/20
									hover:bg-cyan-500/30
									border
									border-cyan-500/40
									text-cyan-300
									text-xs
									font-semibold
									flex
									items-center
									justify-center
									gap-2
									transition-all
									cursor-pointer
									active:scale-95
									shadow-[0_0_15px_rgba(6,182,212,0.2)]
								"
							>
								<Share2 size={14} />
								<span>Compartilhar</span>
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});
