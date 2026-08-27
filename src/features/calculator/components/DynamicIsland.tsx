import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Mic, Sparkles } from "lucide-react";
import { memo, useEffect, useState } from "react";

export type IslandNotification = {
	id: string | number;
	type: "voice" | "item" | "result" | "budget" | "custom";
	title: string;
	subtitle?: string;
	icon?: React.ReactNode;
	durationMs?: number;
};

type Props = {
	isListeningVoice?: boolean;
	voiceTranscript?: string;
	notification?: IslandNotification | null;
	onToggleVoice?: () => void;
	accentColor?: string;
};

export const DynamicIsland = memo(function DynamicIsland({
	isListeningVoice = false,
	voiceTranscript = "",
	notification = null,
	onToggleVoice,
	accentColor = "#22d3ee",
}: Props) {
	const [activeNotification, setActiveNotification] = useState<IslandNotification | null>(null);

	useEffect(() => {
		if (notification) {
			setActiveNotification(notification);
			const timer = setTimeout(() => {
				setActiveNotification(null);
			}, notification.durationMs || 3000);
			return () => clearTimeout(timer);
		}
	}, [notification]);

	// Determina o estado visual
	const isVoiceActive = isListeningVoice;
	const hasNotification = Boolean(activeNotification);
	const isExpanded = isVoiceActive || hasNotification;

	return (
		<div className="w-full flex justify-center items-center py-1 z-30 select-none pointer-events-auto">
			<motion.div
				layout
				transition={{ type: "spring", stiffness: 450, damping: 30 }}
				className={`
					relative
					overflow-hidden
					rounded-full
					bg-black/85
					border
					border-white/12
					backdrop-blur-2xl
					shadow-[0_8px_32px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)]
					flex
					items-center
					justify-between
					transition-colors
					${
						isExpanded
							? "px-3.5 py-1.5 min-h-[34px] max-w-[90%] border-white/25"
							: "px-2.5 py-1 min-h-[26px] max-w-[170px] hover:border-white/20 cursor-pointer"
					}
				`}
				onClick={!isExpanded ? onToggleVoice : undefined}
			>
				{/* Borda holográfica sutil no topo */}
				<div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

				<AnimatePresence mode="wait">
					{/* ESTADO 1: OUVINDO VOZ (COM EQUALIZADOR DINÂMICO) */}
					{isVoiceActive ? (
						<motion.div
							key="voice-mode"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="flex items-center gap-2.5 w-full overflow-hidden"
						>
							<div className="p-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 shrink-0 animate-pulse">
								<Mic size={12} />
							</div>

							<div className="flex-1 min-w-0">
								<span className="text-[11px] font-semibold text-white truncate block font-mono">
									{voiceTranscript || "Ouvindo cálculo..."}
								</span>
							</div>

							{/* Equalizador de Áudio Futurista */}
							<div className="flex items-center gap-0.5 shrink-0 pl-1">
								{[6, 14, 10, 16, 8, 12].map((h, i) => (
									<motion.span
										key={i}
										animate={{
											height: [3, h, 4, h * 0.8, 3],
										}}
										transition={{
											duration: 0.5 + (i % 3) * 0.1,
											repeat: Infinity,
											ease: "easeInOut",
										}}
										className="w-[2px] bg-gradient-to-t from-red-500 to-amber-300 rounded-full"
										style={{ height: h }}
									/>
								))}
							</div>
						</motion.div>
					) : hasNotification && activeNotification ? (
						/* ESTADO 2: NOTIFICAÇÃO DINÂMICA (ITEM ADICIONADO / RESULTADO / ORÇAMENTO) */
						<motion.div
							key={`notif-${activeNotification.id}`}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="flex items-center gap-2 w-full"
						>
							{activeNotification.type === "item" && (
								<div className="p-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
									<CheckCircle2 size={12} />
								</div>
							)}
							{activeNotification.type === "result" && (
								<div className="p-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
									<Sparkles size={12} />
								</div>
							)}
							{activeNotification.type === "budget" && (
								<div className="p-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
									<AlertCircle size={12} />
								</div>
							)}

							<div className="flex-1 min-w-0">
								<span className="text-[11px] font-bold text-white tracking-wide block truncate">
									{activeNotification.title}
								</span>
								{activeNotification.subtitle && (
									<span className="text-[9px] text-zinc-400 font-mono block truncate">
										{activeNotification.subtitle}
									</span>
								)}
							</div>
						</motion.div>
					) : (
						/* ESTADO 3: IDLE AMBIENTE MINIMALISTA */
						<motion.div
							key="idle-mode"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="flex items-center gap-1.5 w-full justify-center"
						>
							<span
								className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_6px_currentColor]"
								style={{ backgroundColor: accentColor, color: accentColor }}
							/>
							<span className="text-[10px] font-bold tracking-wider text-zinc-300 font-mono uppercase">
								SmartCalc HUD
							</span>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	);
});
