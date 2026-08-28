import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeftRight,
	BarChart3,
	BookOpen,
	Check,
	Command,
	Database,
	Download,
	Globe,
	HelpCircle,
	LayoutDashboard,
	Maximize,
	Menu,
	Minimize,
	Palette,
	Scale,
	ScanBarcode,
	ShieldCheck,
	Sparkles,
	SunMedium,
	TrendingUp,
	Utensils,
	Volume2,
	VolumeX,
	X,
} from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { useI18n } from "@/features/i18n";
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
	onOpenAnalytics?: () => void;
	onOpenScanner?: () => void;
	onOpenHelp?: () => void;
	onOpenBackup?: () => void;
	onOpenPrivacy?: () => void;
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
	onOpenThemePicker?: () => void;
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
	onOpenAnalytics,
	onOpenScanner,
	onOpenHelp,
	onOpenBackup,
	onOpenPrivacy,
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
	onOpenThemePicker,
}: Props) {
	const { t, language, languages, setLanguage } = useI18n();
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
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(() => {});
			setIsFullscreen(true);
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen().catch(() => {});
				setIsFullscreen(false);
			}
		}
	};

	return (
		<div
			className="w-full flex items-center justify-between px-1 mb-2 sm:mb-3.5 select-none relative"
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

			{/* Lado Direito: Ações Rápidas (Paleta de Temas + Menu) */}
			<div className="flex items-center gap-1.5">
				{/* Botão de Galeria de Temas Rápido */}
				{onOpenThemePicker && (
					<motion.button
						type="button"
						onClick={onOpenThemePicker}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						aria-label="Abrir Galeria de Temas"
						title="Galeria de Temas e Cores"
						className="p-2 rounded-2xl border bg-white/4 text-zinc-300 border-white/8 hover:text-white hover:bg-white/8 hover:border-white/15 transition-all cursor-pointer flex items-center justify-center"
					>
						<Palette size={17} className={currentTheme.accentText} />
					</motion.button>
				)}

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

				{/* Modal de Opções & Configurações Perfeitamente Centralizado */}
				<AnimatePresence>
					{isOpen && (
						<div
							className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md"
							onClick={() => setIsOpen(false)}
						>
							<motion.div
								initial={{ opacity: 0, scale: 0.94, y: 10 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.94, y: 10 }}
								transition={{ duration: 0.18, ease: "easeOut" }}
								onClick={(e) => e.stopPropagation()}
								className="
									relative
									w-full
									max-w-md
									p-4
									sm:p-5
									rounded-[2rem]
									border
									border-white/14
									tech-modal
									shadow-[0_25px_60px_rgba(0,0,0,0.9)]
									flex
									flex-col
									max-h-[85vh]
									overflow-hidden
								"
							>
								{/* Cabeçalho do Modal */}
								<div className="flex items-center justify-between pb-3 mb-2 border-b border-white/8 shrink-0">
									<div className="flex items-center gap-2">
										<div className="p-1.5 rounded-xl bg-white/6 border border-white/10 text-white">
											<Menu size={16} />
										</div>
										<div>
											<h3 className="text-sm font-semibold text-white tracking-wide">
												{t.menuTitle}
											</h3>
											<p className="text-[11px] text-zinc-400">{t.menuSubtitle}</p>
										</div>
									</div>
									<button
										type="button"
										onClick={() => setIsOpen(false)}
										className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
										title={t.close}
									>
										<X size={18} />
									</button>
								</div>

								{/* Conteúdo Rolável (Com acesso a todas as seções, temas e idiomas) */}
								<div className="overflow-y-auto space-y-4 pr-1 pb-2 custom-scrollbar">
									{/* Seção 1: Ferramentas & Utilitários */}
									<div>
										<p className="text-[11px] uppercase font-semibold text-zinc-400 tracking-wider px-1 py-1 select-none">
											{t.toolsAndUtilities}
										</p>
										<div className="space-y-1 mt-1">
											{/* Estatísticas & Gráficos de Gastos */}
											{onOpenAnalytics && (
												<button
													type="button"
													onClick={() => {
														onOpenAnalytics();
														setIsOpen(false);
													}}
													className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
												>
													<div className="flex items-center gap-2.5">
														<BarChart3 size={15} className="text-cyan-400" />
														<span>{t.spendingAnalytics}</span>
													</div>
													<kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 rounded bg-zinc-800 border border-zinc-700">
														G
													</kbd>
												</button>
											)}

											{/* Comparador de Embalagens */}
											{onOpenComparator && (
												<button
													type="button"
													onClick={() => {
														onOpenComparator();
														setIsOpen(false);
													}}
													className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
												>
													<div className="flex items-center gap-2.5">
														<Scale size={15} className="text-cyan-400" />
														<span>{t.comparePackages}</span>
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
												className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
											>
												<div className="flex items-center gap-2.5">
													<ArrowLeftRight size={15} className={currentTheme.accentText} />
													<span>{t.currencyConverter}</span>
												</div>
												<kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 rounded bg-zinc-800 border border-zinc-700">
													U
												</kbd>
											</button>

											{/* Leitor de Código de Barras */}
											{onOpenScanner && (
												<button
													type="button"
													onClick={() => {
														onOpenScanner();
														setIsOpen(false);
													}}
													className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
												>
													<div className="flex items-center gap-2.5">
														<ScanBarcode size={15} className="text-emerald-400" />
														<span>Leitor de Código de Barras</span>
													</div>
													<kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 rounded bg-zinc-800 border border-zinc-700">
														B
													</kbd>
												</button>
											)}

											{/* Divisor de Contas */}
											<button
												type="button"
												onClick={() => {
													onOpenSplitBill();
													setIsOpen(false);
												}}
												className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
											>
												<div className="flex items-center gap-2.5">
													<Utensils size={15} className="text-teal-400" />
													<span>{t.splitBill}</span>
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
												className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
											>
												<div className="flex items-center gap-2.5">
													<TrendingUp size={15} className="text-amber-400" />
													<span>{t.financeSimulator}</span>
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
												className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
											>
												<div className="flex items-center gap-2.5">
													<Sparkles
														size={15}
														className={isAdvanced ? currentTheme.accentText : "text-zinc-400"}
													/>
													<span>{t.scientificMode}</span>
												</div>
												<span
													className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
														isAdvanced
															? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
															: "bg-zinc-800 border-zinc-700 text-zinc-400"
													}`}
												>
													{isAdvanced ? t.active : t.standard}
												</span>
											</button>
										</div>
									</div>

									{/* Seção 2: Visual & Configurações */}
									<div className="pt-2 border-t border-white/8">
										<p className="text-[11px] uppercase font-semibold text-zinc-400 tracking-wider px-1 py-1 select-none">
											{t.visualAndSettings}
										</p>
										<div className="space-y-1 mt-1">
											{/* Modo Estúdio Amplo */}
											{onToggleStudioMode && (
												<button
													type="button"
													onClick={onToggleStudioMode}
													className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
												>
													<div className="flex items-center gap-2.5">
														<LayoutDashboard size={15} className="text-indigo-400" />
														<span>{t.studioLayout}</span>
													</div>
													<span
														className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
															isStudioMode
																? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
																: "bg-zinc-800 border-zinc-700 text-zinc-400"
														}`}
													>
														{isStudioMode ? t.active : t.auto}
													</span>
												</button>
											)}

											{/* Legendas de Teclas (Keycaps) */}
											{onToggleKeycaps && (
												<button
													type="button"
													onClick={onToggleKeycaps}
													className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
												>
													<div className="flex items-center gap-2.5">
														<Command size={15} className="text-zinc-300" />
														<span>{t.keycaps}</span>
													</div>
													<span
														className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
															showKeycaps
																? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
																: "bg-zinc-800 border-zinc-700 text-zinc-400"
														}`}
													>
														{showKeycaps ? t.visible : t.hidden}
													</span>
												</button>
											)}

											{/* Modo Compacto */}
											{onToggleCompactMode && (
												<button
													type="button"
													onClick={onToggleCompactMode}
													className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
												>
													<div className="flex items-center gap-2.5">
														<Minimize size={15} className="text-zinc-300" />
														<span>{t.compactMode}</span>
													</div>
													<span
														className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
															isCompactMode
																? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
																: "bg-zinc-800 border-zinc-700 text-zinc-400"
														}`}
													>
														{isCompactMode ? t.active : t.standard}
													</span>
												</button>
											)}

											{/* Modo Tela Cheia */}
											<button
												type="button"
												onClick={toggleFullscreen}
												className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
											>
												<div className="flex items-center gap-2.5">
													{isFullscreen ? (
														<Minimize size={15} className="text-zinc-300" />
													) : (
														<Maximize size={15} className="text-zinc-300" />
													)}
													<span>{t.fullscreen}</span>
												</div>
												<kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 rounded bg-zinc-800 border border-zinc-700">
													F11
												</kbd>
											</button>

											{/* Tela Sempre Acesa (Wake Lock) */}
											{onToggleWakeLock && (
												<button
													type="button"
													onClick={onToggleWakeLock}
													className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
												>
													<div className="flex items-center gap-2.5">
														<SunMedium
															size={15}
															className={
																isWakeLockActive ? "text-amber-400 animate-pulse" : "text-zinc-400"
															}
														/>
														<span>{t.screenAlwaysOn}</span>
													</div>
													<span
														className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
															isWakeLockActive
																? "bg-amber-500/15 border-amber-500/30 text-amber-300"
																: "bg-zinc-800 border-zinc-700 text-zinc-400"
														}`}
													>
														{isWakeLockActive ? t.active : t.standard}
													</span>
												</button>
											)}

											{/* Efeitos Sonoros */}
											<button
												type="button"
												onClick={onToggleMute}
												className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
											>
												<div className="flex items-center gap-2.5">
													{isMuted ? (
														<VolumeX size={15} className="text-zinc-500" />
													) : (
														<Volume2 size={15} className="text-emerald-400" />
													)}
													<span>{t.soundEffects}</span>
												</div>
												<span
													className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
														isMuted
															? "bg-zinc-800 border-zinc-700 text-zinc-500"
															: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
													}`}
												>
													{isMuted ? t.muted : t.on}
												</span>
											</button>

											{/* Atalhos de Teclado */}
											<button
												type="button"
												onClick={() => {
													onOpenShortcuts();
													setIsOpen(false);
												}}
												className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
											>
												<div className="flex items-center gap-2.5">
													<HelpCircle size={15} className="text-zinc-300" />
													<span>{t.keyboardShortcuts}</span>
												</div>
												<kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 rounded bg-zinc-800 border border-zinc-700">
													?
												</kbd>
											</button>

											{/* Backup & Restauração JSON */}
											{onOpenBackup && (
												<button
													type="button"
													onClick={() => {
														onOpenBackup();
														setIsOpen(false);
													}}
													className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
												>
													<div className="flex items-center gap-2.5">
														<Database size={15} className="text-cyan-400" />
														<span>{t.backupRestore}</span>
													</div>
													<span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono">
														.json
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
													className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
												>
													<div className="flex items-center gap-2.5">
														<Download size={15} className="text-cyan-400" />
														<span>{t.installApp}</span>
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
													className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
												>
													<div className="flex items-center gap-2.5">
														<BookOpen size={15} className={currentTheme.accentText} />
														<span>{t.helpAndGuide}</span>
													</div>
													<kbd className="px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 rounded bg-zinc-800 border border-zinc-700">
														H
													</kbd>
												</button>
											)}

											{/* Termos & Privacidade (LGPD) */}
											{onOpenPrivacy && (
												<button
													type="button"
													onClick={() => {
														onOpenPrivacy();
														setIsOpen(false);
													}}
													className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-200 hover:text-white hover:bg-white/8 transition-colors outline-none cursor-pointer"
												>
													<div className="flex items-center gap-2.5">
														<ShieldCheck size={15} className="text-emerald-400" />
														<span>Privacidade & Termos</span>
													</div>
													<span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-medium">
														LGPD
													</span>
												</button>
											)}
										</div>
									</div>

									{/* Seção 3: Idioma & Moeda */}
									<div className="pt-2 border-t border-white/8">
										<div className="flex items-center gap-1.5 px-1 py-1 select-none mb-1.5">
											<Globe size={14} className="text-cyan-400" />
											<p className="text-[11px] uppercase font-semibold text-zinc-400 tracking-wider">
												{t.languageSection}
											</p>
										</div>

										<div className="grid grid-cols-3 gap-1.5 p-1.5 bg-zinc-950/60 rounded-2xl border border-white/8">
											{languages.map((l) => {
												const isSelected = language === l.code;
												return (
													<button
														key={l.code}
														type="button"
														onClick={() => setLanguage(l.code)}
														className={`
															flex
															flex-col
															items-center
															justify-center
															py-2
															px-1
															rounded-xl
															transition-all
															duration-150
															outline-none
															cursor-pointer
															${
																isSelected
																	? "bg-white/12 ring-1 ring-white/30 text-white font-semibold shadow-sm"
																	: "text-zinc-400 hover:text-zinc-200 hover:bg-white/6"
															}
														`}
													>
														<span className="text-base mb-0.5">{l.flag}</span>
														<span className="text-[11px] truncate">{l.name}</span>
														<span className="text-[9px] text-zinc-500 font-mono">
															({l.currencySymbol})
														</span>
													</button>
												);
											})}
										</div>
									</div>

									{/* Seção 4: Temas de Cor da Calculadora */}
									<div className="pt-2 border-t border-white/8">
										<div className="flex items-center justify-between px-1 py-1 select-none mb-1.5">
											<div className="flex items-center gap-1.5">
												<Palette size={14} className="text-cyan-400" />
												<p className="text-[11px] uppercase font-semibold text-zinc-400 tracking-wider">
													{t.themesSection}
												</p>
											</div>
											{onOpenThemePicker && (
												<button
													type="button"
													onClick={() => {
														setIsOpen(false);
														onOpenThemePicker();
													}}
													className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold hover:underline cursor-pointer"
												>
													Ver Galeria
												</button>
											)}
										</div>

										<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 bg-zinc-950/60 rounded-2xl border border-white/8">
											{allThemes.map((tTheme) => {
												const isSelected = currentTheme.id === tTheme.id;
												return (
													<button
														key={tTheme.id}
														type="button"
														onClick={() => onSelectTheme(tTheme.id)}
														className={`
															relative
															group
															flex
															items-center
															gap-2.5
															p-2
															rounded-xl
															transition-all
															duration-150
															outline-none
															cursor-pointer
															${
																isSelected
																	? "bg-white/12 ring-1 ring-white/30 shadow-md"
																	: "hover:bg-white/6 bg-white/2"
															}
														`}
													>
														<span
															style={{
																backgroundColor: tTheme.hex,
																boxShadow: isSelected
																	? `0 0 12px ${tTheme.hex}, 0 0 4px ${tTheme.hex}`
																	: `0 0 5px ${tTheme.hex}80`,
															}}
															className={`
																w-5
																h-5
																shrink-0
																rounded-full
																border
																border-white/30
																transition-transform
																duration-150
																group-hover:scale-110
																flex
																items-center
																justify-center
															`}
														>
															{isSelected && <Check size={11} className="text-black stroke-3" />}
														</span>
														<span
															className={`text-xs font-medium truncate ${
																isSelected ? "text-white font-semibold" : "text-zinc-300"
															}`}
														>
															{tTheme.name}
														</span>
													</button>
												);
											})}
										</div>
									</div>
								</div>
							</motion.div>
						</div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
});
