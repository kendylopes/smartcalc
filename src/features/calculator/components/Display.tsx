import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
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
};

export const Display = memo(function Display({
	value,
	preview,
	isLimitReached,
	isResult,
	cursorColor = "text-cyan-400",
	operatorColor = "text-cyan-400",
	onSwipeDelete,
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

				{/* Top bar do display: Indicador de Copiar / Copiado */}
				<div className="w-full flex items-center justify-between pointer-events-none z-10">
					<div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider select-none">
						{isResult ? "RESULTADO" : "ENTRADA"}
					</div>

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
								<span>0</span>
								<span
									className={`inline-block ml-1 font-extralight select-none animate-pulse ${cursorColor}`}
								>
									|
								</span>
							</div>
						) : (
							<div className="flex items-baseline justify-end text-3xl sm:text-4xl md:text-[2.6rem] font-light text-white tabular-nums flex-nowrap shrink-0">
								{tokens.map((token, idx) => {
									const tokenKey = `t-${idx}-${token.raw}`;
									if (token.type === "operator") {
										return (
											<span
												key={tokenKey}
												className={`inline-flex items-center justify-center px-1 font-normal select-none ${operatorColor}`}
											>
												{token.formatted}
											</span>
										);
									}
									if (token.type === "parenthesis") {
										return (
											<span
												key={tokenKey}
												className="inline-block px-0.5 text-zinc-400 font-normal select-none"
											>
												{token.formatted}
											</span>
										);
									}
									return (
										<span
											key={tokenKey}
											className="inline-block text-white font-light tracking-tight tabular-nums"
										>
											{token.formatted}
										</span>
									);
								})}

								{/* Cursor de digitação estático e firme */}
								<span
									className={`inline-block ml-1 font-extralight select-none animate-pulse ${cursorColor}`}
								>
									|
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Área do Live Preview (Resultado prévio em tempo real fixo no rodapé do visor) */}
				<div className="h-6 w-full flex items-center justify-end">
					{safePreview && !isResult ? (
						<div className="flex items-baseline justify-end gap-1.5 text-zinc-400">
							<span className="text-zinc-600 font-light text-sm select-none">=</span>
							<span className="text-base sm:text-lg font-light text-zinc-300 tracking-tight tabular-nums">
								{formatNumberPtBR(safePreview)}
							</span>
						</div>
					) : null}
				</div>
			</div>

			{/* Mensagem de limite de caracteres atingido */}
			<AnimatePresence>
				{isLimitReached && (
					<motion.p
						initial={{ opacity: 0, y: 2 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="mt-1 text-xs text-right text-red-400/90 font-medium"
					>
						Limite máximo de caracteres atingido
					</motion.p>
				)}
			</AnimatePresence>
		</div>
	);
});
