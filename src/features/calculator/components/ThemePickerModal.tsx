import { AnimatePresence, motion } from "framer-motion";
import { Check, Moon, Palette, Sparkles, Sun, X } from "lucide-react";
import { memo } from "react";
import type { ColorMode, ThemeConfig, ThemeId } from "../hooks/useThemes";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	currentTheme: ThemeConfig;
	allThemes: ThemeConfig[];
	onSelectTheme: (id: ThemeId) => void;
	colorMode?: ColorMode;
	onToggleColorMode?: () => void;
	onPlayClick?: () => void;
};

export const ThemePickerModal = memo(function ThemePickerModal({
	isOpen,
	onClose,
	currentTheme,
	allThemes,
	onSelectTheme,
	colorMode = "dark",
	onToggleColorMode,
	onPlayClick,
}: Props) {
	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md">
				{/* Backdrop click to close */}
				<div className="absolute inset-0" onClick={onClose} />

				<motion.div
					initial={{ opacity: 0, scale: 0.94, y: 15 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.94, y: 15 }}
					transition={{ type: "spring", stiffness: 450, damping: 28 }}
					className="relative w-full max-w-lg overflow-hidden rounded-[2.4rem] neu-modal p-5 sm:p-6 shadow-2xl z-10 border border-white/10 select-none bg-[#0e111a]/95 backdrop-blur-2xl"
				>
					{/* Header */}
					<div className="flex items-center justify-between pb-4 border-b border-white/8">
						<div className="flex items-center gap-3">
							<div className="p-2.5 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
								<Palette size={20} />
							</div>
							<div>
								<h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
									<span>Galeria de Temas</span>
									<span className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-zinc-300 font-mono font-normal">
										Cristal Líquido
									</span>
								</h3>
								<p className="text-xs text-zinc-400">
									Personalize o acabamento e iluminação do Smart Calc
								</p>
							</div>
						</div>

						<button
							type="button"
							onClick={() => {
								onPlayClick?.();
								onClose();
							}}
							aria-label="Fechar"
							className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
						>
							<X size={18} />
						</button>
					</div>

					{/* Modo Claro / Escuro Toggle */}
					{onToggleColorMode && (
						<div className="my-3 p-2.5 rounded-2xl bg-white/4 border border-white/6 flex items-center justify-between">
							<div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
								{colorMode === "dark" ? (
									<Moon size={15} className="text-cyan-400" />
								) : (
									<Sun size={15} className="text-amber-400" />
								)}
								<span>
									Modo Atual:{" "}
									<strong className="text-white">
										{colorMode === "dark" ? "Dark OLED" : "Pearl Crystal (Claro)"}
									</strong>
								</span>
							</div>
							<button
								type="button"
								onClick={() => {
									onPlayClick?.();
									onToggleColorMode();
								}}
								className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
							>
								<Sparkles size={12} className="text-cyan-300" />
								<span>Alternar</span>
							</button>
						</div>
					)}

					{/* Grid de Cards de Temas */}
					<div className="grid grid-cols-2 gap-3 py-2 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
						{allThemes.map((tTheme) => {
							const isSelected = currentTheme.id === tTheme.id;
							return (
								<motion.button
									key={tTheme.id}
									type="button"
									onClick={() => {
										onPlayClick?.();
										onSelectTheme(tTheme.id);
									}}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.97 }}
									className={`
										relative
										p-3.5
										rounded-2xl
										text-left
										transition-all
										duration-200
										outline-none
										cursor-pointer
										overflow-hidden
										border
										${
											isSelected
												? "bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.12)] ring-1 ring-white/30"
												: "bg-white/3 hover:bg-white/6 border-white/6 hover:border-white/15"
										}
									`}
								>
									{/* Miniatura Ilustrativa da Calculadora */}
									<div className="w-full h-18 rounded-xl bg-black/50 border border-white/10 p-1.5 flex flex-col justify-between mb-2.5 overflow-hidden relative">
										{/* Mini Visor */}
										<div className="w-full h-5 rounded-lg bg-white/5 border border-white/10 px-1.5 flex items-center justify-between">
											<div
												className="w-1.5 h-1.5 rounded-full"
												style={{ backgroundColor: tTheme.hex }}
											/>
											<span
												className="text-[9px] font-mono font-bold"
												style={{ color: tTheme.hex }}
											>
												128.50
											</span>
										</div>

										{/* Mini Teclado */}
										<div className="grid grid-cols-4 gap-1">
											<div className="h-2 rounded-sm bg-white/10" />
											<div className="h-2 rounded-sm bg-white/10" />
											<div className="h-2 rounded-sm bg-white/10" />
											<div
												className="h-2 rounded-sm"
												style={{
													backgroundColor: tTheme.hex,
													boxShadow: `0 0 6px ${tTheme.hex}80`,
												}}
											/>
										</div>

										{/* Reflexo de vidro */}
										<div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
									</div>

									{/* Nome do Tema e Cor */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2 min-w-0">
											<span
												className="w-3.5 h-3.5 rounded-full border border-white/40 shrink-0"
												style={{
													backgroundColor: tTheme.hex,
													boxShadow: isSelected
														? `0 0 10px ${tTheme.hex}`
														: `0 0 4px ${tTheme.hex}80`,
												}}
											/>
											<span className="text-xs font-bold text-white truncate">{tTheme.name}</span>
										</div>

										{isSelected && (
											<div className="w-4 h-4 rounded-full bg-cyan-400 text-black flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.6)]">
												<Check size={11} strokeWidth={3} />
											</div>
										)}
									</div>
								</motion.button>
							);
						})}
					</div>

					{/* Botão de Concluir */}
					<div className="pt-3 mt-3 border-t border-white/8">
						<button
							type="button"
							onClick={() => {
								onPlayClick?.();
								onClose();
							}}
							className="w-full py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all active:scale-98 cursor-pointer"
						>
							Aplicar Tema
						</button>
					</div>
				</motion.div>
			</div>
		</AnimatePresence>
	);
});
