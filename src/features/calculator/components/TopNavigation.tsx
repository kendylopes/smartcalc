import { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeftRight,
	BookOpen,
	Check,
	Download,
	HelpCircle,
	Maximize2,
	Menu,
	Minimize2,
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
	isWakeLockActive?: boolean;
	onToggleWakeLock?: () => void;
	isCompactMode?: boolean;
	onToggleCompactMode?: () => void;
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
	isWakeLockActive = false,
	onToggleWakeLock,
	isCompactMode = false,
	onToggleCompactMode,
	onInstallPwa,
	currentTheme,
	allThemes,
	onSelectTheme,
}: Props) {
	const [isOpen, setIsOpen] = useState(false);
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

	return (
		<div className="w-full flex items-center justify-between px-1 mb-3.5 select-none relative" ref={menuRef}>
			{/* Lado Esquerdo: Logo 3D + SmartCalc */}
			<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/4 border border-white/8 backdrop-blur-md shadow-sm">
				<img
					src="/logo.png"
					alt="Smart Calc"
					className="w-4 h-4 rounded-md shadow-[0_0_8px_rgba(6,182,212,0.5)] object-cover"
				/>
				<span className="text-xs font-semibold tracking-wide text-zinc-100 font-display">
					SmartCalc
				</span>
				<div
					className={`w-1.5 h-1.5 rounded-full ${currentTheme.dotColor} shadow-[0_0_6px_currentColor] animate-pulse ml-0.5`}
				/>
			</div>

			{/* Lado Direito: Botão Menu Hambúrguer */}
			<div className="relative">
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
								w-72
								p-2.5
								rounded-3xl
								border
								border-white/12
								tech-modal
								shadow-[0_20px_50px_rgba(0,0,0,0.95)]
								space-y-2.5
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
											S
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
											<Sparkles size={14} className={isAdvanced ? currentTheme.accentText : "text-zinc-400"} />
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
													className={isWakeLockActive ? "text-amber-400 animate-spin-slow" : "text-zinc-400"}
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

									{/* Modo Compacto */}
									{onToggleCompactMode && (
										<button
											type="button"
											onClick={() => {
												onToggleCompactMode();
											}}
											className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
										>
											<div className="flex items-center gap-2.5">
												{isCompactMode ? (
													<Maximize2 size={14} className={currentTheme.accentText} />
												) : (
													<Minimize2 size={14} className="text-zinc-400" />
												)}
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

									{/* Som */}
									<button
										type="button"
										onClick={() => {
											onToggleMute();
										}}
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
												!isMuted
													? "text-emerald-400 bg-emerald-500/10"
													: "text-zinc-500 bg-white/4"
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
													{isSelected && <Check size={11} className="text-black stroke-[3]" />}
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
