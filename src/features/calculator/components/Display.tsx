import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, History, Mic, ScanBarcode } from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { formatDisplay, formatNumberPtBR, tokenizeDisplay } from "../utils/format";

type Props = {
	value: string;
	preview: string;
	isLimitReached: boolean;
	isResult: boolean;
	cursorColor?: string;
	operatorColor?: string;
	onSwipeDelete?: () => void;
	onToggleHistory?: () => void;
	historyCount?: number;
	isHistoryOpen?: boolean;
	onToggleVoice?: () => void;
	isListeningVoice?: boolean;
	voiceTranscript?: string;
	onOpenScanner?: () => void;
};

export const Display = memo(function Display({
	value,
	preview,
	isLimitReached,
	isResult,
	cursorColor = "text-cyan-400",
	operatorColor = "text-cyan-400",
	onSwipeDelete,
	onToggleHistory,
	historyCount = 0,
	isHistoryOpen = false,
	onToggleVoice,
	isListeningVoice = false,
	voiceTranscript = "",
	onOpenScanner,
}: Props) {
	const [copied, setCopied] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);
	const touchStartXRef = useRef<number | null>(null);

	const safeValue = typeof value === "string" ? value : "";
	const safePreview = typeof preview === "string" ? preview : "";
	const showInitialZero = safeValue === "" && !isResult;

	// Mantém o final da conta sempre ancorado e visível na extrema direita (scroll horizontal)
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
		}
	}, [safeValue, isResult]);

	const handleCopy = () => {
		const target = isResult ? formatNumberPtBR(safeValue) : formatDisplay(safeValue) || "0";
		navigator.clipboard.writeText(target);
		setCopied(true);
		setTimeout(() => setCopied(false), 1600);
	};

	// Suporte ao Gesto Swipe to Delete (Deslizar para a esquerda ou direita para apagar o último dígito)
	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartXRef.current = e.touches[0].clientX;
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (touchStartXRef.current === null) return;
		const endX = e.changedTouches[0].clientX;
		const diffX = touchStartXRef.current - endX;

		// Deslizou mais de 35px para a esquerda ou direita
		if (Math.abs(diffX) > 35 && onSwipeDelete) {
			onSwipeDelete();
		}
		touchStartXRef.current = null;
	};

	const tokens = useMemo(() => tokenizeDisplay(safeValue), [safeValue]);

	return (
		<div
			className={`
				mb-3
				w-full
				transition-all
				duration-200
				${isLimitReached ? "drop-shadow-[0_0_18px_rgba(239,68,68,0.3)]" : ""}
			`}
		>
			<div
				onClick={handleCopy}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
				title="Clique para copiar | Deslize para apagar"
				className="
					group/display
					cursor-pointer
					h-40 sm:h-44
					w-full
					flex
					flex-col
					justify-between
					overflow-hidden
					relative
					px-4
					py-3
					rounded-[1.8rem]
					neu-display
					transition-all
					duration-150
				"
			>
				{/* Borda interna técnica de alta precisão */}
				<div className="absolute inset-px rounded-[calc(1.8rem-1px)] border border-white/5 pointer-events-none" />

				{/* Top bar do display: Botão de Histórico + Indicador de Copiar */}
				<div className="w-full flex items-center justify-between z-10">
					{/* Canto Esquerdo: Ícone de Histórico & Microfone de Voz */}
					<div className="flex items-center gap-1.5">
						{onToggleHistory && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onToggleHistory();
								}}
								title={isHistoryOpen ? "Ocultar Histórico" : "Abrir Histórico"}
								aria-label="Abrir ou ocultar histórico de cálculos"
								className={`
									flex
									items-center
									gap-1
									p-1.5
									rounded-full
									border
									transition-all
									cursor-pointer
									active:scale-95
									${
										isHistoryOpen
											? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.25)]"
											: "bg-white/4 text-zinc-400 border-white/8 hover:text-white hover:bg-white/8 hover:border-white/15"
									}
								`}
							>
								<History size={14} className={isHistoryOpen ? "text-cyan-400" : "text-zinc-400"} />
								{historyCount > 0 && (
									<span className="px-1.5 py-0.2 rounded-full font-mono text-[9px] bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
										{historyCount}
									</span>
								)}
							</button>
						)}

						{onToggleVoice && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onToggleVoice();
								}}
								title={
									isListeningVoice
										? "Parar de ouvir"
										: "Falar para somar (Ditar cálculo ou produto)"
								}
								aria-label="Falar para somar"
								className={`
									flex
									items-center
									gap-1
									px-2
									py-1
									rounded-full
									border
									transition-all
									cursor-pointer
									active:scale-95
									${
										isListeningVoice
											? "bg-red-500/25 text-red-300 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.35)] animate-pulse"
											: "bg-white/4 text-zinc-400 border-white/8 hover:text-white hover:bg-white/8 hover:border-white/15"
									}
								`}
							>
								<Mic
									size={13}
									className={isListeningVoice ? "text-red-400 animate-bounce" : "text-zinc-400"}
								/>
								{isListeningVoice ? (
									<span className="text-[10px] font-semibold text-red-300 font-mono max-w-32 truncate">
										{voiceTranscript || "Ouvindo..."}
									</span>
								) : (
									<span className="text-[10px] font-mono text-zinc-400">Voz</span>
								)}
							</button>
						)}

						{onOpenScanner && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onOpenScanner();
								}}
								title="Escanear Código de Barras (Câmera)"
								aria-label="Escanear código de barras"
								className="
									flex
									items-center
									gap-1
									px-2
									py-1
									rounded-full
									border
									border-white/8
									bg-white/4
									text-zinc-400
									hover:text-white
									hover:bg-white/8
									hover:border-white/15
									transition-all
									cursor-pointer
									active:scale-95
								"
							>
								<ScanBarcode size={13} className="text-zinc-400" />
								<span className="text-[10px] font-mono text-zinc-400">Scan</span>
							</button>
						)}
					</div>

					{/* Canto Direito: Copiar / Copiado */}
					<div className="pointer-events-none">
						<AnimatePresence>
							{copied ? (
								<motion.div
									initial={{ opacity: 0, y: -2 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.1 }}
									className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium"
								>
									<Check size={11} />
									<span>Copiado!</span>
								</motion.div>
							) : (
								<div className="opacity-0 group-hover/display:opacity-60 transition-opacity duration-150 flex items-center gap-1 text-[11px] text-zinc-400">
									<Copy size={11} />
									<span>Copiar</span>
								</div>
							)}
						</AnimatePresence>
					</div>
				</div>

				{/* Área Principal de Exibição (Linha ÚNICA horizontal estável, sem quebrar linhas e sem tremer) */}
				<div className="flex-1 w-full flex items-center justify-end overflow-hidden my-auto">
					<div
						ref={scrollRef}
						className="w-full overflow-x-auto overflow-y-hidden scrollbar-none flex items-center justify-end text-right whitespace-nowrap scroll-smooth"
					>
						{isResult ? (
							<div className="text-3xl sm:text-4xl md:text-[2.6rem] font-light tracking-tight text-white tabular-nums select-all">
								{formatNumberPtBR(safeValue)}
							</div>
						) : showInitialZero ? (
							<div className="flex items-baseline justify-end text-3xl sm:text-4xl md:text-[2.6rem] font-light text-white tabular-nums">
								<span className="font-light">0</span>
								<span
									className={`inline-block w-0.5 h-7 sm:h-9 bg-cyan-400 ml-1.5 animate-pulse rounded-full ${cursorColor}`}
								/>
							</div>
						) : (
							<div className="flex items-baseline justify-end text-3xl sm:text-4xl md:text-[2.6rem] font-light text-white tabular-nums">
								{tokens.map((token, idx) => (
									<span
										key={`${token.raw}-${idx}`}
										className={
											token.type === "operator"
												? `mx-1 font-medium select-none ${operatorColor}`
												: "text-white select-all"
										}
									>
										{token.formatted}
									</span>
								))}
								<span
									className={`inline-block w-0.5 h-7 sm:h-9 bg-cyan-400 ml-1.5 animate-pulse rounded-full ${cursorColor}`}
								/>
							</div>
						)}
					</div>
				</div>

				{/* Rodapé Interno do Display: Preview Dinâmico do Resultado em Tempo Real */}
				<div className="w-full flex items-center justify-end min-h-6 z-10 pointer-events-none">
					<AnimatePresence>
						{safePreview && !isResult && (
							<motion.div
								initial={{ opacity: 0, y: 3 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 3 }}
								transition={{ duration: 0.12 }}
								className="text-xs sm:text-sm font-medium tracking-wide text-zinc-400 tabular-nums flex items-center gap-1"
							>
								<span className="text-[11px] font-mono text-zinc-500 select-none">=</span>
								<span>{formatNumberPtBR(safePreview)}</span>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
});
