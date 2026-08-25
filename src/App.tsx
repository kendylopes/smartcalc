import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Delete, History, ShoppingBag, Sparkles } from "lucide-react";

import {
	BackupModal,
	CalculatorButton,
	Display,
	HelpModal,
	HistoryPanel,
	KeyboardShortcutsModal,
	PriceComparatorModal,
	QuantityModal,
	QuickToolsPanel,
	SplitBillModal,
	TopNavigation,
} from "@/features/calculator/components";
import { BASIC_BUTTONS, SCIENTIFIC_FUNCTIONS } from "@/features/calculator/constants";
import {
	useCalculator,
	useHapticFeedback,
	useKeyboard,
	useSoundFeedback,
	useThemes,
} from "@/features/calculator/hooks";
import { ConverterModal } from "@/features/converter";
import { FinanceModal } from "@/features/finance";
import {
	FeaturesSection,
	PixDonationModal,
	SavingsGuideSection,
	SiteFooter,
	SiteHeader,
	WhyUsSection,
} from "@/features/landing";
import { PwaInstallBanner, usePwaInstall, useWakeLock } from "@/features/pwa";
import { Toaster } from "@/components/ui/sonner";

export function App() {
	const [showHistory, setShowHistory] = useState(false);
	const [isAdvanced, setIsAdvanced] = useState(false);
	const [isCompactMode, setIsCompactMode] = useState(false);
	const [isStudioMode, setIsStudioMode] = useState<boolean>(() => {
		try {
			const saved = localStorage.getItem("smartcalc-studio-mode");
			if (saved !== null) return saved === "true";
			return typeof window !== "undefined" && window.innerWidth >= 1200;
		} catch {
			return false;
		}
	});
	const [showKeycaps, setShowKeycaps] = useState<boolean>(() => {
		try {
			return localStorage.getItem("smartcalc-keycaps") !== "false";
		} catch {
			return true;
		}
	});

	const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
	const [isHelpOpen, setIsHelpOpen] = useState(false);
	const [isBackupOpen, setIsBackupOpen] = useState(false);
	const [isPixOpen, setIsPixOpen] = useState(false);
	const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
	const [isComparatorOpen, setIsComparatorOpen] = useState(false);
	const [isConverterOpen, setIsConverterOpen] = useState(false);
	const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
	const [isFinanceOpen, setIsFinanceOpen] = useState(false);
	const [activeKey, setActiveKey] = useState<string | null>(null);

	const { theme, allThemes, setTheme, colorMode, toggleColorMode } = useThemes();
	const { isMuted, toggleMute, playClick, playOperator, playResult, playDelete } =
		useSoundFeedback();
	const { triggerHaptic } = useHapticFeedback(true);
	const { isInstallable, installApp } = usePwaInstall();
	const { isActive: isWakeLockActive, toggleWakeLock } = useWakeLock();

	const {
		value,
		preview,
		input,
		calculate,
		clear,
		deleteLast,
		toggleSign,
		applySquareRoot,
		applySquare,
		applyInverse,
		applyPi,
		getLastNumber,
		applyQuantity,
		history,
		deleteHistoryItem,
		updateHistoryItemTag,
		clearHistory,
		selectFromHistory,
		isLimitReached,
		isResult,
	} = useCalculator();

	const toggleStudioMode = () => {
		setIsStudioMode((prev) => {
			const next = !prev;
			try {
				localStorage.setItem("smartcalc-studio-mode", String(next));
			} catch (e) {
				console.error(e);
			}
			return next;
		});
	};

	const toggleKeycaps = () => {
		setShowKeycaps((prev) => {
			const next = !prev;
			try {
				localStorage.setItem("smartcalc-keycaps", String(next));
			} catch (e) {
				console.error(e);
			}
			return next;
		});
	};

	const handleKeyboardInput = useCallback(
		(k: string) => {
			playClick();
			triggerHaptic("click");
			input(k);
		},
		[playClick, triggerHaptic, input],
	);

	const handleKeyboardCalculate = useCallback(() => {
		playResult();
		triggerHaptic("result");
		calculate();
	}, [playResult, triggerHaptic, calculate]);

	const handleKeyboardClear = useCallback(() => {
		playDelete();
		triggerHaptic("delete");
		clear();
	}, [playDelete, triggerHaptic, clear]);

	const handleKeyboardDeleteLast = useCallback(() => {
		playDelete();
		triggerHaptic("delete");
		deleteLast();
	}, [playDelete, triggerHaptic, deleteLast]);

	const handleOpenQuantity = useCallback(() => {
		setIsQuantityModalOpen(true);
	}, []);

	const handleOpenComparator = useCallback(() => {
		setIsComparatorOpen(true);
	}, []);

	const handleOpenHelp = useCallback(() => {
		setIsHelpOpen(true);
	}, []);

	const handleOpenConverter = useCallback(() => {
		setIsConverterOpen(true);
	}, []);

	const handleOpenSplitBill = useCallback(() => {
		setIsSplitBillOpen(true);
	}, []);

	const handleOpenFinance = useCallback(() => {
		setIsFinanceOpen(true);
	}, []);

	const handleOpenBackup = useCallback(() => {
		setIsBackupOpen(true);
	}, []);

	// Hook de Teclado Global
	useKeyboard({
		input: handleKeyboardInput,
		calculate: handleKeyboardCalculate,
		clear: handleKeyboardClear,
		deleteLast: handleKeyboardDeleteLast,
		openQuantity: handleOpenQuantity,
		openComparator: handleOpenComparator,
		openHelp: handleOpenHelp,
		openConverter: handleOpenConverter,
		openSplitBill: handleOpenSplitBill,
		openFinance: handleOpenFinance,
		setActiveKey: setActiveKey,
	});

	// Transferir valores de retorno dos modais
	const handleTransferFromModal = (val: string) => {
		clear();
		const clean = val.replace(",", ".");
		const parts = clean.split("");
		for (const p of parts) {
			input(p === "." ? "." : p);
		}
	};

	const handleClick = (btn: string) => {
		if (btn === "C") {
			playDelete();
			triggerHaptic("delete");
			clear();
		} else if (btn === "Del") {
			playDelete();
			triggerHaptic("delete");
			deleteLast();
		} else if (btn === "=") {
			playResult();
			triggerHaptic("result");
			calculate();
		} else if (btn === "+/-") {
			playClick();
			triggerHaptic("click");
			toggleSign();
		} else if (["+", "-", "*", "/", "%"].includes(btn)) {
			playOperator();
			triggerHaptic("operator");
			input(btn);
		} else {
			playClick();
			triggerHaptic("click");
			input(btn);
		}
	};

	return (
		<div className="min-h-screen w-full bg-ambient flex flex-col justify-between select-none overflow-x-hidden font-display transition-colors duration-300">
			{/* NAVBAR INSTITUCIONAL SUPERIOR */}
			<SiteHeader
				colorMode={colorMode}
				onToggleColorMode={toggleColorMode}
				onOpenPix={() => setIsPixOpen(true)}
				isPwaInstallable={isInstallable}
				onInstallPwa={installApp}
				theme={theme}
			/>

			{/* HERO SECTION: CALCULADORA AO VIVO */}
			<main id="calculadora" className="w-full flex flex-col items-center justify-center pt-8 pb-14 px-2 sm:px-4 md:px-6">
				{/* Título Hero de Boas-Vindas */}
				<div className="text-center max-w-2xl mx-auto mb-6 px-4 space-y-2">
					<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
						<Sparkles size={13} />
						<span>A Calculadora mais Inteligente da Web</span>
					</div>
					<h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
						Compras de Mercado, Divisão de Contas & Finanças
					</h1>
					<p className="text-xs sm:text-sm text-zinc-400">
						Experimente a calculadora abaixo ao vivo ou utilize os atalhos rápidos do teclado.
					</p>
				</div>

				{/* CONTAINER PRINCIPAL DA CALCULADORA */}
				<div className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-4 sm:gap-6">
					{/* MODO ESTÚDIO: PAINEL ESQUERDO DE FERRAMENTAS RÁPIDAS (DESKTOP) */}
					{isStudioMode && !isCompactMode && (
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.25 }}
							className="hidden lg:flex"
						>
							<QuickToolsPanel
								theme={theme}
								onOpenComparator={handleOpenComparator}
								onOpenSplitBill={handleOpenSplitBill}
								onOpenFinance={handleOpenFinance}
								onOpenConverter={handleOpenConverter}
								onOpenHelp={handleOpenHelp}
								onOpenBackup={handleOpenBackup}
								onPlayClick={playClick}
							/>
						</motion.div>
					)}

					{/* CARD PRINCIPAL DA CALCULADORA */}
					<section
						className={`
							relative
							w-full
							overflow-hidden
							rounded-[2.4rem]
							sm:rounded-[2.6rem]
							neu-chassis
							p-4
							sm:p-5
							flex
							flex-col
							justify-between
							transition-all
							duration-300
							${isCompactMode ? "max-w-76" : "max-w-90 sm:max-w-95 md:w-95"}
						`}
					>
						{/* TOP NAVIGATION COM MENU HAMBÚRGUER */}
						<TopNavigation
							isAdvanced={isAdvanced}
							onToggleAdvanced={() => setIsAdvanced((prev) => !prev)}
							isMuted={isMuted}
							onToggleMute={toggleMute}
							onOpenShortcuts={() => setIsShortcutsOpen(true)}
							onOpenConverter={() => setIsConverterOpen(true)}
							onOpenSplitBill={() => setIsSplitBillOpen(true)}
							onOpenFinance={() => setIsFinanceOpen(true)}
							onOpenComparator={() => setIsComparatorOpen(true)}
							onOpenHelp={handleOpenHelp}
							onOpenBackup={handleOpenBackup}
							isWakeLockActive={isWakeLockActive}
							onToggleWakeLock={toggleWakeLock}
							isCompactMode={isCompactMode}
							onToggleCompactMode={() => setIsCompactMode((prev) => !prev)}
							isStudioMode={isStudioMode}
							onToggleStudioMode={toggleStudioMode}
							showKeycaps={showKeycaps}
							onToggleKeycaps={toggleKeycaps}
							colorMode={colorMode}
							onToggleColorMode={toggleColorMode}
							isPwaInstallable={isInstallable}
							onInstallPwa={installApp}
							currentTheme={theme}
							allThemes={allThemes}
							onSelectTheme={setTheme}
						/>

						{/* VISOR DISPLAY */}
						<Display
							value={value}
							preview={preview}
							isLimitReached={isLimitReached}
							isResult={isResult}
							cursorColor={theme.accentText}
							operatorColor={theme.accentText}
							onSwipeDelete={() => {
								playDelete();
								triggerHaptic("delete");
								deleteLast();
							}}
						/>

						{/* BARRA DE AÇÕES RÁPIDAS SUPERIOR */}
						<div className="flex items-center justify-between gap-1.5 my-2.5 px-0.5">
							{/* Botão Multiplicador de Quantidade / Compras */}
							<button
								type="button"
								onClick={() => {
									playClick();
									triggerHaptic("click");
									setIsQuantityModalOpen(true);
								}}
								title="Adicionar produto / quantidade (Q)"
								className="
									flex
									items-center
									gap-1.5
									px-3
									py-1.5
									rounded-2xl
									bg-white/4
									hover:bg-white/8
									border
									border-white/8
									hover:border-white/15
									text-zinc-300
									hover:text-white
									text-xs
									font-medium
									transition-all
									duration-150
									active:scale-95
									outline-none
									cursor-pointer
								"
							>
								<ShoppingBag size={13} className={theme.accentText} />
								<span>Quantidade</span>
							</button>

							{/* Botão Alternar Histórico */}
							<button
								type="button"
								onClick={() => {
									playClick();
									triggerHaptic("click");
									setShowHistory((prev) => !prev);
								}}
								title="Mostrar / Ocultar Histórico"
								className={`
									flex
									items-center
									gap-1.5
									px-3
									py-1.5
									rounded-2xl
									border
									transition-all
									duration-150
									text-xs
									font-medium
									active:scale-95
									outline-none
									cursor-pointer
									${
										showHistory || isStudioMode
											? `${theme.accentText} ${theme.operatorBgActive} ${theme.operatorBorderActive}`
											: "bg-white/4 text-zinc-400 border-white/8 hover:text-white hover:bg-white/8"
									}
								`}
							>
								<History size={13} />
								<span>Histórico</span>
								{history.length > 0 && (
									<span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
										{history.length}
									</span>
								)}
							</button>
						</div>

						{/* TECLADO CIENTÍFICO EXPANSÍVEL */}
						<AnimatePresence>
							{isAdvanced && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.2 }}
									className="overflow-hidden mb-2"
								>
									<div className="grid grid-cols-6 gap-1.5 p-1.5 rounded-2xl bg-zinc-900/60 border border-white/6 backdrop-blur-sm">
										{SCIENTIFIC_FUNCTIONS.map((btn) => (
											<CalculatorButton
												key={btn}
												label={btn}
												variant="scientific"
												size="compact"
												showKeycap={showKeycaps}
												onClick={() => {
													playOperator();
													triggerHaptic("operator");
													if (btn === "√") applySquareRoot();
													if (btn === "x²") applySquare();
													if (btn === "1/x") applyInverse();
													if (btn === "π") applyPi();
													if (btn === "(" || btn === ")") input(btn);
												}}
												theme={theme}
											/>
										))}
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* TECLADO NUMÉRICO PRINCIPAL */}
						<div className="grid grid-cols-4 gap-2 sm:gap-2.5">
							{BASIC_BUTTONS.map((btn) => (
								<CalculatorButton
									key={btn}
									label={btn}
									icon={btn === "Del" ? <Delete size={18} /> : undefined}
									onClick={() => handleClick(btn)}
									isActive={activeKey === btn}
									showKeycap={showKeycaps}
									theme={theme}
								/>
							))}
						</div>
					</section>

					{/* HISTÓRICO PANEL CARD NEUMÓRFICO COM ANIMAÇÃO */}
					<AnimatePresence>
						{(showHistory || (isStudioMode && !isCompactMode)) && (
							<motion.aside
								initial={{ opacity: 0, x: 20, scale: 0.98 }}
								animate={{ opacity: 1, x: 0, scale: 1 }}
								exit={{ opacity: 0, x: 20, scale: 0.98 }}
								transition={{ duration: 0.2 }}
								className="relative w-full max-w-90 sm:max-w-95 md:w-76 lg:w-80 overflow-hidden rounded-[2.4rem] neu-panel p-4 sm:p-4.5 flex flex-col justify-between"
							>
								<HistoryPanel
									history={history}
									theme={theme}
									onClose={() => setShowHistory(false)}
									onSelect={(res) => {
										playClick();
										triggerHaptic("click");
										selectFromHistory(res);
									}}
									onDelete={(id) => {
										playDelete();
										triggerHaptic("delete");
										deleteHistoryItem(id);
									}}
									onUpdateTag={updateHistoryItemTag}
									onClearAll={() => {
										playDelete();
										triggerHaptic("delete");
										clearHistory();
									}}
								/>
							</motion.aside>
						)}
					</AnimatePresence>
				</div>
			</main>

			{/* SEÇÕES INSTITUCIONAIS DO PORTAL WEB */}
			<FeaturesSection
				theme={theme}
				onOpenComparator={handleOpenComparator}
				onOpenSplitBill={handleOpenSplitBill}
				onOpenFinance={handleOpenFinance}
				onOpenConverter={handleOpenConverter}
				onOpenQuantity={handleOpenQuantity}
			/>

			<SavingsGuideSection />

			<WhyUsSection theme={theme} />

			{/* FOOTER INSTITUCIONAL */}
			<SiteFooter theme={theme} onOpenPix={() => setIsPixOpen(true)} />

			{/* Banner discreto de instalação PWA */}
			<PwaInstallBanner isInstallable={isInstallable} onInstall={installApp} />

			{/* Modal de Atalhos de Teclado */}
			<KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />

			{/* Subtela / Modal de Quantidade & Produto de Supermercado */}
			<QuantityModal
				isOpen={isQuantityModalOpen}
				initialUnitPrice={getLastNumber() || ""}
				onClose={() => setIsQuantityModalOpen(false)}
				onConfirm={(unitPrice, qty, productName) => {
					applyQuantity(unitPrice, qty, productName);
				}}
				theme={theme}
				onPlayClick={playClick}
				onPlayConfirm={playResult}
			/>

			{/* Modal de Comparador de Preços e Embalagens (kg/L) */}
			<PriceComparatorModal
				isOpen={isComparatorOpen}
				onClose={() => setIsComparatorOpen(false)}
				onTransferToCalculator={handleTransferFromModal}
				theme={theme}
				onPlayClick={playClick}
				onPlayConfirm={playResult}
			/>

			{/* Modal de Conversor de Moedas e Unidades */}
			<ConverterModal
				isOpen={isConverterOpen}
				initialValue={getLastNumber() || "1"}
				onClose={() => setIsConverterOpen(false)}
				onTransferToCalculator={handleTransferFromModal}
				theme={theme}
				onPlayClick={playClick}
			/>

			{/* Modal de Divisão de Contas / Gorjeta (WhatsApp) */}
			<SplitBillModal
				isOpen={isSplitBillOpen}
				initialAmount={getLastNumber() || ""}
				onClose={() => setIsSplitBillOpen(false)}
				onTransferToCalculator={handleTransferFromModal}
				theme={theme}
				onPlayClick={playClick}
				onPlayConfirm={playResult}
			/>

			{/* Modal de Simulador Financeiro (Parcelamento & Juros Compostos) */}
			<FinanceModal
				isOpen={isFinanceOpen}
				initialAmount={getLastNumber() || ""}
				onClose={() => setIsFinanceOpen(false)}
				onTransferToCalculator={handleTransferFromModal}
				theme={theme}
				onPlayClick={playClick}
				onPlayConfirm={playResult}
			/>

			{/* Central de Ajuda & Guia de Uso */}
			<HelpModal
				isOpen={isHelpOpen}
				onClose={() => setIsHelpOpen(false)}
				theme={theme}
			/>

			{/* Modal de Backup & Restauração JSON */}
			<BackupModal
				isOpen={isBackupOpen}
				onClose={() => setIsBackupOpen(false)}
				theme={theme}
			/>

			{/* Modal de Apoio PIX */}
			<PixDonationModal
				isOpen={isPixOpen}
				onClose={() => setIsPixOpen(false)}
				theme={theme}
			/>

			{/* Notificações Toast do shadcn/ui */}
			<Toaster />
		</div>
	);
}
