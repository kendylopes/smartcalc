import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeftRight,
	BookOpen,
	Check,
	Command,
	Database,
	Download,
	HelpCircle,
	LayoutDashboard,
	Maximize,
	Menu,
	Minimize,
	Palette,
	Scale,
	Sparkles,
	SunMedium,
	TrendingUp,
	Utensils,
	Volume2,
	VolumeX,
	X,
} from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import type { ThemeConfig, ThemeId } from "../hooks/useThemes";

type Props = {
	isAdvanced: boolean;
	onToggleAdvanced: () => void;
	isMuted: boolean;
	onToggleMute: () => void;
	onOpenShortcuts: () => void;
	onOpenConverter: () => void;
	onOpenSplitBill: () => void;
	onOpenFinance: () => void;
	onOpenComparator?: () => void;
	onOpenHelp?: () => void;
	onOpenBackup?: () => void;
	isWakeLockActive?: boolean;
	onToggleWakeLock?: () => void;
	isCompactMode?: boolean;
	onToggleCompactMode?: () => void;
	isStudioMode?: boolean;
	onToggleStudioMode?: () => void;
	showKeycaps?: boolean;
	onToggleKeycaps?: () => void;
	isPwaInstallable?: boolean;
	onInstallPwa?: () => void;
	currentTheme: ThemeConfig;
	allThemes: ThemeConfig[];
	onSelectTheme: (id: ThemeId) => void;
};

export const TopNavigation = memo(function TopNavigation({
	isAdvanced,
	onToggleAdvanced,
	isMuted,
	onToggleMute,
	onOpenShortcuts,
	onOpenConverter,
	onOpenSplitBill,
	onOpenFinance,
	onOpenComparator,
	onOpenHelp,
	onOpenBackup,
	isWakeLockActive = false,
	onToggleWakeLock,
	isCompactMode = false,
	onToggleCompactMode,
	isStudioMode = false,
	onToggleStudioMode,
	showKeycaps = false,
	onToggleKeycaps,
	onInstallPwa,
	currentTheme,
	allThemes,
	onSelectTheme,
}: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Fechar menu ao clicar fora
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	// Alternar Tela Cheia
	const toggleFullscreen = () => {
		try {
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen();
				setIsFullscreen(true);
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				}
				setIsFullscreen(false);
			}
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<div
			className="w-full flex items-center justify-between px-1 mb-3.5 select-none relative"
			ref={menuRef}
		>
			{/* Lado Esquerdo: Identificação Sutil de Status */}
			<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/4 border border-white/6 backdrop-blur-md">
				<div
					className={`w-1.5 h-1.5 rounded-full ${currentTheme.dotColor} shadow-[0_0_6px_currentColor] animate-pulse`}
				/>
				<span className="text-[11px] font-medium text-zinc-400 font-display">
					{isAdvanced ? "Científica" : "Padrão"}
				</span>
			</div>

			{/* Lado Direito: Ações Rápidas (Menu) */}
			<div className="flex items-center gap-1.5">

				{/* Botão Menu Hambúrguer */}
				<motion.button
					type="button"
					onClick={() => setIsOpen((prev) => !prev)}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					aria-label={isOpen ? "Fechar menu" : "Abrir menu de opções"}
					title="Menu de Ferramentas e Configurações"
					className={`
						p-2
						rounded-2xl
						border
						transition-all
						duration-150
						outline-none
						focus-visible:ring-1
						focus-visible:ring-cyan-400
						cursor-pointer
						${
							isOpen
								? "bg-zinc-800 text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.08)]"
								: "bg-white/4 text-zinc-300 border-white/8 hover:text-white hover:bg-white/8"
						}
					`}
				>
					<AnimatePresence mode="wait" initial={false}>
						{isOpen ? (
							<motion.div
								key="close"
								initial={{ rotate: -90, opacity: 0 }}
								animate={{ rotate: 0, opacity: 1 }}
								exit={{ rotate: 90, opacity: 0 }}
								transition={{ duration: 0.12 }}
							>
								<X size={17} />
							</motion.div>
						) : (
							<motion.div
								key="menu"
								initial={{ rotate: 90, opacity: 0 }}
								animate={{ rotate: 0, opacity: 1 }}
								exit={{ rotate: -90, opacity: 0 }}
								transition={{ duration: 0.12 }}
							>
								<Menu size={17} />
							</motion.div>
						)}
					</AnimatePresence>
				</motion.button>

				{/* Dropdown Menu Flutuante */}
				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: -6 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: -6 }}
							transition={{ duration: 0.14, ease: "easeOut" }}
							className="
								absolute
								top-11
								right-0
								z-50
								w-76
								p-2.5
								rounded-3xl
								border
								border-white/12
								tech-modal
								shadow-[0_20px_50px_rgba(0,0,0,0.95)]
								space-y-2.5
								max-h-[85vh]
								overflow-y-auto
								scrollbar-none
							"
						>
							{/* Seção 1: Ferramentas & Utilitários */}
							<div>
								<p className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider px-2 py-1 select-none">
									Ferramentas & Utilitários
								</p>
								<div className="space-y-0.5 mt-0.5">
									{/* Comparador de Embalagens */}
									{onOpenComparator && (
										<button
											type="button"
											onClick={() => {
												onOpenComparator();
												setIsOpen(false);
											}}
											className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
										>
											<div className="flex items-center gap-2.5">
												<Scale size={14} className="text-cyan-400" />
												<span>Comparar Embalagens (kg/L)</span>
											</div>
											<kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 rounded bg-zinc-800 border border-zinc-700">
												P
											</kbd>
										</button>
									)}

									{/* Conversor */}
									<button
										type="button"
										onClick={() => {
											onOpenConverter();
											setIsOpen(false);
										}}
										className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
									>
										<div className="flex items-center gap-2.5">
											<ArrowLeftRight size={14} className={currentTheme.accentText} />
											<span>Conversor de Moedas</span>
										</div>
										<kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 rounded bg-zinc-800 border border-zinc-700">
											U
										</kbd>
									</button>

									{/* Rachar Conta / Split Bill */}
									<button
										type="button"
										onClick={() => {
											onOpenSplitBill();
											setIsOpen(false);
										}}
										className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
									>
										<div className="flex items-center gap-2.5">
											<Utensils size={14} className="text-emerald-400" />
											<span>Rachar a Conta (Gorjeta)</span>
										</div>
										<kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 rounded bg-zinc-800 border border-zinc-700">
											D
										</kbd>
									</button>

									{/* Simulador Financeiro */}
									<button
										type="button"
										onClick={() => {
											onOpenFinance();
											setIsOpen(false);
										}}
										className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
									>
										<div className="flex items-center gap-2.5">
											<TrendingUp size={14} className="text-amber-400" />
											<span>Simulador de Finanças</span>
										</div>
										<kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 rounded bg-zinc-800 border border-zinc-700">
											F
										</kbd>
									</button>

									{/* Modo Científico */}
									<button
										type="button"
										onClick={() => {
											onToggleAdvanced();
										}}
										className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
									>
										<div className="flex items-center gap-2.5">
											<Sparkles
												size={14}
												className={isAdvanced ? currentTheme.accentText : "text-zinc-400"}
											/>
											<span>Modo Científico</span>
										</div>
										<span
											className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
												isAdvanced
													? `${currentTheme.accentText} bg-white/10`
													: "text-zinc-500 bg-white/4"
											}`}
										>
											{isAdvanced ? "Ligado" : "Básico"}
										</span>
									</button>
								</div>
							</div>

							{/* Seção 2: Visual & Preferências */}
							<div className="pt-2 border-t border-white/8">
								<p className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider px-2 py-1 select-none">
									Visual & Configurações
								</p>
								<div className="space-y-0.5 mt-0.5">
									{/* Modo Estúdio Multi-Painel */}
									{onToggleStudioMode && (
										<button
											type="button"
											onClick={onToggleStudioMode}
											className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
										>
											<div className="flex items-center gap-2.5">
												<LayoutDashboard
													size={14}
													className={isStudioMode ? currentTheme.accentText : "text-zinc-400"}
												/>
												<span>Layout Estúdio Amplo</span>
											</div>
											<span
												className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
													isStudioMode
														? `${currentTheme.accentText} bg-white/10`
														: "text-zinc-500 bg-white/4"
												}`}
											>
												{isStudioMode ? "Ativo" : "Auto"}
											</span>
										</button>
									)}

									{/* Pro Keycaps (Dicas de Teclado) */}
									{onToggleKeycaps && (
										<button
											type="button"
											onClick={onToggleKeycaps}
											className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
										>
											<div className="flex items-center gap-2.5">
												<Command
													size={14}
													className={showKeycaps ? currentTheme.accentText : "text-zinc-400"}
												/>
												<span>Dicas de Teclas (Keycaps)</span>
											</div>
											<span
												className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
													showKeycaps
														? "text-cyan-300 bg-cyan-500/10 font-semibold"
														: "text-zinc-500 bg-white/4"
												}`}
											>
												{showKeycaps ? "Visíveis" : "Ocultas"}
											</span>
										</button>
									)}

									{/* Modo Compacto */}
									{onToggleCompactMode && (
										<button
											type="button"
											onClick={onToggleCompactMode}
											className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
										>
											<div className="flex items-center gap-2.5">
												<LayoutDashboard
													size={14}
													className={isCompactMode ? currentTheme.accentText : "text-zinc-400"}
												/>
												<span>Modo Compacto</span>
											</div>
											<span
												className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
													isCompactMode
														? `${currentTheme.accentText} bg-white/10`
														: "text-zinc-500 bg-white/4"
												}`}
											>
												{isCompactMode ? "Ativo" : "Normal"}
											</span>
										</button>
									)}

									{/* Tela Cheia Imersiva */}
									<button
										type="button"
										onClick={toggleFullscreen}
										className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
									>
										<div className="flex items-center gap-2.5">
											{isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
											<span>Modo Tela Cheia</span>
										</div>
										<span className="text-[10px] text-zinc-500 font-mono">F11</span>
									</button>

									{/* Manter Tela Acesa (Wake Lock) */}
									{onToggleWakeLock && (
										<button
											type="button"
											onClick={onToggleWakeLock}
											className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
										>
											<div className="flex items-center gap-2.5">
												<SunMedium
													size={14}
													className={
														isWakeLockActive ? "text-amber-400 animate-spin-slow" : "text-zinc-400"
													}
												/>
												<span>Tela Sempre Acesa</span>
											</div>
											<span
												className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
													isWakeLockActive
														? "text-amber-400 bg-amber-500/10 font-semibold"
														: "text-zinc-500 bg-white/4"
												}`}
											>
												{isWakeLockActive ? "Ativa" : "Padrão"}
											</span>
										</button>
									)}

									{/* Som */}
									<button
										type="button"
										onClick={onToggleMute}
										className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
									>
										<div className="flex items-center gap-2.5">
											{isMuted ? (
												<VolumeX size={14} className="text-zinc-500" />
											) : (
												<Volume2 size={14} className={currentTheme.accentText} />
											)}
											<span>Efeitos Sonoros</span>
										</div>
										<span
											className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
												!isMuted ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-500 bg-white/4"
											}`}
										>
											{!isMuted ? "Ligado" : "Mudo"}
										</span>
									</button>

									{/* Guia de Atalhos */}
									<button
										type="button"
										onClick={() => {
											onOpenShortcuts();
											setIsOpen(false);
										}}
										className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
									>
										<div className="flex items-center gap-2.5">
											<HelpCircle size={14} className="text-zinc-400" />
											<span>Atalhos de Teclado</span>
										</div>
										<kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 rounded bg-zinc-800 border border-zinc-700">
											?
										</kbd>
									</button>

									{/* Backup & Restauração */}
									{onOpenBackup && (
										<button
											type="button"
											onClick={() => {
												onOpenBackup();
												setIsOpen(false);
											}}
											className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
										>
											<div className="flex items-center gap-2.5">
												<Database size={14} className="text-cyan-400" />
												<span>Backup & Restauração</span>
											</div>
											<span className="text-[10px] text-zinc-400 font-mono">.json</span>
										</button>
									)}

									{/* Instalar PWA */}
									{onInstallPwa && (
										<button
											type="button"
											onClick={() => {
												onInstallPwa();
												setIsOpen(false);
											}}
											className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
										>
											<div className="flex items-center gap-2.5">
												<Download size={14} className="text-cyan-400" />
												<span>Instalar Aplicativo</span>
											</div>
											<span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-semibold">
												PWA
											</span>
										</button>
									)}

									{/* Central de Ajuda & Guia de Uso */}
									{onOpenHelp && (
										<button
											type="button"
											onClick={() => {
												onOpenHelp();
												setIsOpen(false);
											}}
											className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
										>
											<div className="flex items-center gap-2.5">
												<BookOpen size={14} className={currentTheme.accentText} />
												<span>Ajuda & Como Usar</span>
											</div>
											<kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 rounded bg-zinc-800 border border-zinc-700">
												H
											</kbd>
										</button>
									)}
								</div>
							</div>

							{/* Seção 3: Temas de Cor */}
							<div className="pt-2 border-t border-white/8">
								<div className="flex items-center gap-1.5 px-2 py-1 select-none">
									<Palette size={12} className="text-zinc-400" />
									<p className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
										Tema da Calculadora
									</p>
								</div>

								<div className="grid grid-cols-5 gap-1.5 p-1.5 bg-zinc-900/80 rounded-2xl border border-white/8 mt-1">
									{allThemes.map((t) => {
										const isSelected = currentTheme.id === t.id;
										return (
											<button
												key={t.id}
												type="button"
												onClick={() => onSelectTheme(t.id)}
												title={t.name}
												className={`
													relative
													group
													flex
													flex-col
													items-center
													justify-center
													p-1.5
													rounded-xl
													transition-all
													duration-150
													outline-none
													cursor-pointer
													${isSelected ? "bg-white/12 ring-1 ring-white/30 shadow-sm" : "hover:bg-white/6"}
												`}
											>
												<span
													style={{
														backgroundColor: t.hex,
														boxShadow: isSelected
															? `0 0 14px ${t.hex}, 0 0 6px ${t.hex}`
															: `0 0 6px ${t.hex}80`,
													}}
													className={`
														w-5
														h-5
														rounded-full
														border
														border-white/30
														transition-transform
														duration-150
														group-hover:scale-115
														flex
														items-center
														justify-center
													`}
												>
													{isSelected && <Check size={11} className="text-black stroke-3" />}
												</span>
											</button>
										);
									})}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
});
