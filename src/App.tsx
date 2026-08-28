import { AnimatePresence, motion } from "framer-motion";
import { Delete, ShoppingBag } from "lucide-react";
import { lazy, Suspense, useCallback, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import {
	CalculatorButton,
	Display,
	HistoryPanel,
	QuickToolsPanel,
	TopNavigation,
} from "@/features/calculator/components";
import { BASIC_BUTTONS, SCIENTIFIC_FUNCTIONS } from "@/features/calculator/constants";
import {
	useCalculator,
	useHapticFeedback,
	useKeyboard,
	useSoundFeedback,
	useThemes,
	useVoiceInput,
} from "@/features/calculator/hooks";
import { SiteHeader } from "@/features/landing";
import { AdBannerSlot } from "@/features/monetization";
import { PwaInstallBanner, usePwaInstall, useWakeLock } from "@/features/pwa";

// Lazy loading sob demanda de modais e seções pesadas para otimização do bundle
const SpendingDashboardModal = lazy(() =>
	import("@/features/analytics/components/SpendingDashboardModal").then((m) => ({
		default: m.SpendingDashboardModal,
	})),
);
const BarcodeScannerModal = lazy(() =>
	import("@/features/scanner/components/BarcodeScannerModal").then((m) => ({
		default: m.BarcodeScannerModal,
	})),
);
const ConverterModal = lazy(() =>
	import("@/features/converter/components/ConverterModal").then((m) => ({
		default: m.ConverterModal,
	})),
);
const FinanceModal = lazy(() =>
	import("@/features/finance/components/FinanceModal").then((m) => ({
		default: m.FinanceModal,
	})),
);
const PrivacyPolicyModal = lazy(() =>
	import("@/features/legal/components/PrivacyPolicyModal").then((m) => ({
		default: m.PrivacyPolicyModal,
	})),
);
const BackupModal = lazy(() =>
	import("@/features/calculator/components/BackupModal").then((m) => ({
		default: m.BackupModal,
	})),
);
const DiscountProfitModal = lazy(() =>
	import("@/features/calculator/components/DiscountProfitModal").then((m) => ({
		default: m.DiscountProfitModal,
	})),
);
const FuelCalculatorModal = lazy(() =>
	import("@/features/calculator/components/FuelCalculatorModal").then((m) => ({
		default: m.FuelCalculatorModal,
	})),
);
const HelpModal = lazy(() =>
	import("@/features/calculator/components/HelpModal").then((m) => ({
		default: m.HelpModal,
	})),
);
const KeyboardShortcutsModal = lazy(() =>
	import("@/features/calculator/components/KeyboardShortcutsModal").then((m) => ({
		default: m.KeyboardShortcutsModal,
	})),
);
const PriceComparatorModal = lazy(() =>
	import("@/features/calculator/components/PriceComparatorModal").then((m) => ({
		default: m.PriceComparatorModal,
	})),
);
const ProductNameModal = lazy(() =>
	import("@/features/calculator/components/ProductNameModal").then((m) => ({
		default: m.ProductNameModal,
	})),
);
const QuantityModal = lazy(() =>
	import("@/features/calculator/components/QuantityModal").then((m) => ({
		default: m.QuantityModal,
	})),
);
const ReceiptImageModal = lazy(() =>
	import("@/features/calculator/components/ReceiptImageModal").then((m) => ({
		default: m.ReceiptImageModal,
	})),
);
const SplitBillModal = lazy(() =>
	import("@/features/calculator/components/SplitBillModal").then((m) => ({
		default: m.SplitBillModal,
	})),
);
const ThemePickerModal = lazy(() =>
	import("@/features/calculator/components/ThemePickerModal").then((m) => ({
		default: m.ThemePickerModal,
	})),
);
const PixDonationModal = lazy(() =>
	import("@/features/landing/components/PixDonationModal").then((m) => ({
		default: m.PixDonationModal,
	})),
);
const FeaturesSection = lazy(() =>
	import("@/features/landing/components/FeaturesSection").then((m) => ({
		default: m.FeaturesSection,
	})),
);
const SavingsGuideSection = lazy(() =>
	import("@/features/landing/components/SavingsGuideSection").then((m) => ({
		default: m.SavingsGuideSection,
	})),
);
const WhyUsSection = lazy(() =>
	import("@/features/landing/components/WhyUsSection").then((m) => ({
		default: m.WhyUsSection,
	})),
);
const SiteFooter = lazy(() =>
	import("@/features/landing/components/SiteFooter").then((m) => ({
		default: m.SiteFooter,
	})),
);

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
	const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
	const [isHelpOpen, setIsHelpOpen] = useState(false);
	const [isBackupOpen, setIsBackupOpen] = useState(false);
	const [isPixOpen, setIsPixOpen] = useState(false);
	const [isProductNameModalOpen, setIsProductNameModalOpen] = useState(false);
	const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
	const [isComparatorOpen, setIsComparatorOpen] = useState(false);
	const [isConverterOpen, setIsConverterOpen] = useState(false);
	const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
	const [isFinanceOpen, setIsFinanceOpen] = useState(false);
	const [isFuelOpen, setIsFuelOpen] = useState(false);
	const [isDiscountOpen, setIsDiscountOpen] = useState(false);
	const [isReceiptImageOpen, setIsReceiptImageOpen] = useState(false);
	const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
	const [isScannerOpen, setIsScannerOpen] = useState(false);
	const [isLegalOpen, setIsLegalOpen] = useState(false);
	const [legalInitialTab, setLegalInitialTab] = useState<"privacy" | "terms">("privacy");
	const [activeKey, setActiveKey] = useState<string | null>(null);

	const { theme, allThemes, setTheme, colorMode, toggleColorMode } = useThemes();
	const { isMuted, toggleMute, playClick, playOperator, playResult, playDelete, playScannerBeep } =
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

	// Handlers de Teclado
	const handleKeyboardInput = useCallback(
		(char: string) => {
			playClick();
			triggerHaptic("click");
			input(char);
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
		setIsProductNameModalOpen(true);
	}, []);

	const handleOpenComparator = useCallback(() => {
		setIsComparatorOpen(true);
	}, []);

	const handleOpenAnalytics = useCallback(() => {
		setIsAnalyticsOpen(true);
	}, []);

	const handleOpenScanner = useCallback(() => {
		setIsScannerOpen(true);
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

	const handleOpenFuel = useCallback(() => {
		setIsFuelOpen(true);
	}, []);

	const handleOpenDiscount = useCallback(() => {
		setIsDiscountOpen(true);
	}, []);

	const handleOpenBackup = useCallback(() => {
		setIsBackupOpen(true);
	}, []);

	const handleOpenPrivacy = useCallback(() => {
		setLegalInitialTab("privacy");
		setIsLegalOpen(true);
	}, []);

	const handleOpenTerms = useCallback(() => {
		setLegalInitialTab("terms");
		setIsLegalOpen(true);
	}, []);

	// Atalhos Globais de Teclado
	useKeyboard({
		input: handleKeyboardInput,
		calculate: handleKeyboardCalculate,
		clear: handleKeyboardClear,
		deleteLast: handleKeyboardDeleteLast,
		openQuantity: handleOpenQuantity,
		openComparator: handleOpenComparator,
		openAnalytics: handleOpenAnalytics,
		openScanner: handleOpenScanner,
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

	// Reconhecimento de Voz Inteligente ("Falar para Somar")
	const {
		isListening: isListeningVoice,
		transcript: voiceTranscript,
		toggleListening: toggleVoice,
	} = useVoiceInput({
		onProductRecognized: (productName, unitPrice, quantity) => {
			applyQuantity(unitPrice, quantity, productName);
		},
		onMathRecognized: (expression) => {
			handleTransferFromModal(expression);
			calculate();
		},
		onPriceRecognized: (price) => {
			handleTransferFromModal(price);
		},
		onPlaySuccess: playScannerBeep,
		onPlayError: playDelete,
	});

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
			<main
				id="calculadora"
				className="w-full flex flex-col items-center justify-center py-2 sm:py-8 px-2 sm:px-4 md:px-6"
			>
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
								showKeycaps={showKeycaps}
								onOpenScanner={handleOpenScanner}
								onOpenComparator={handleOpenComparator}
								onOpenAnalytics={handleOpenAnalytics}
								onOpenSplitBill={handleOpenSplitBill}
								onOpenFinance={handleOpenFinance}
								onOpenConverter={handleOpenConverter}
								onOpenFuel={handleOpenFuel}
								onOpenDiscount={handleOpenDiscount}
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
							rounded-[2.2rem]
							sm:rounded-[2.6rem]
							neu-chassis
							p-3.5
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
							onOpenAnalytics={handleOpenAnalytics}
							onOpenScanner={handleOpenScanner}
							onOpenHelp={handleOpenHelp}
							onOpenBackup={handleOpenBackup}
							onOpenPrivacy={handleOpenPrivacy}
							isWakeLockActive={isWakeLockActive}
							onToggleWakeLock={toggleWakeLock}
							isCompactMode={isCompactMode}
							onToggleCompactMode={() => setIsCompactMode((prev) => !prev)}
							isStudioMode={isStudioMode}
							onToggleStudioMode={toggleStudioMode}
							showKeycaps={showKeycaps}
							onToggleKeycaps={toggleKeycaps}
							isPwaInstallable={isInstallable}
							onInstallPwa={installApp}
							currentTheme={theme}
							allThemes={allThemes}
							onSelectTheme={setTheme}
							onOpenThemePicker={() => setIsThemePickerOpen(true)}
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
							onToggleHistory={() => {
								playClick();
								triggerHaptic("click");
								setShowHistory((prev) => !prev);
							}}
							historyCount={history.length}
							isHistoryOpen={showHistory || isStudioMode}
							onToggleVoice={toggleVoice}
							isListeningVoice={isListeningVoice}
							voiceTranscript={voiceTranscript}
							onOpenScanner={handleOpenScanner}
						/>

						{/* BARRA DE AÇÃO RÁPIDA: ITEM & QUANTIDADE (MERCADO) */}
						<div className="my-1.5 sm:my-2.5 px-0.5">
							<button
								type="button"
								onClick={() => {
									playClick();
									triggerHaptic("click");
									setIsProductNameModalOpen(true);
								}}
								title="Adicionar item com preço e quantidade ao cálculo (Atalho: Q)"
								className="
									w-full
									flex
									items-center
									justify-center
									gap-2
									py-2 sm:py-2.5
									px-3 sm:px-4
									rounded-2xl
									bg-white/5
									hover:bg-white/10
									border
									border-white/10
									hover:border-cyan-500/40
									text-white
									text-xs
									font-medium
									transition-all
									cursor-pointer
									active:scale-98
									shadow-sm
									neu-convex
								"
							>
								<div
									className={`p-1 rounded-lg ${theme.operatorBgActive || "bg-cyan-500/10"} ${theme.accentText}`}
								>
									<ShoppingBag size={14} />
								</div>
								<span className="font-semibold tracking-wide">Item & Quantidade</span>
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
						<div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
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
									onOpenReceiptImage={() => setIsReceiptImageOpen(true)}
									onOpenAnalytics={handleOpenAnalytics}
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

				{/* BANNER DE MONETIZAÇÃO / AFILIADOS DISCRETO */}
				<div className="w-full max-w-5xl mx-auto px-4 mt-6">
					<AdBannerSlot />
				</div>
			</main>

			{/* SEÇÕES INSTITUCIONAIS DO PORTAL WEB (CARREGADAS SOB DEMANDA) */}
			<Suspense fallback={null}>
				<FeaturesSection
					theme={theme}
					onOpenComparator={handleOpenComparator}
					onOpenSplitBill={handleOpenSplitBill}
					onOpenFinance={handleOpenFinance}
					onOpenConverter={handleOpenConverter}
					onOpenQuantity={handleOpenQuantity}
					onOpenFuel={handleOpenFuel}
					onOpenDiscount={handleOpenDiscount}
					onOpenAnalytics={handleOpenAnalytics}
				/>
				<SavingsGuideSection />
				<WhyUsSection theme={theme} />
				<SiteFooter
					theme={theme}
					onOpenPix={() => setIsPixOpen(true)}
					onOpenPrivacy={handleOpenPrivacy}
					onOpenTerms={handleOpenTerms}
				/>
			</Suspense>

			{/* Banner discreto de instalação PWA */}
			<PwaInstallBanner isInstallable={isInstallable} onInstall={installApp} />

			{/* MODAIS CARREGADOS SOB DEMANDA (LAZY) */}
			<Suspense fallback={null}>
				{isShortcutsOpen && (
					<KeyboardShortcutsModal
						isOpen={isShortcutsOpen}
						onClose={() => setIsShortcutsOpen(false)}
					/>
				)}

				{isProductNameModalOpen && (
					<ProductNameModal
						isOpen={isProductNameModalOpen}
						initialUnitPrice={getLastNumber() || ""}
						onClose={() => setIsProductNameModalOpen(false)}
						onConfirm={(unitPrice, qty, productName) => {
							applyQuantity(unitPrice, qty, productName);
						}}
						history={history}
						theme={theme}
						onPlayClick={playClick}
						onPlayConfirm={playScannerBeep}
					/>
				)}

				{isQuantityModalOpen && (
					<QuantityModal
						isOpen={isQuantityModalOpen}
						initialUnitPrice={getLastNumber() || ""}
						onClose={() => setIsQuantityModalOpen(false)}
						onConfirm={(unitPrice, qty, productName) => {
							applyQuantity(unitPrice, qty, productName);
						}}
						theme={theme}
						onPlayClick={playClick}
						onPlayConfirm={playScannerBeep}
					/>
				)}

				{isComparatorOpen && (
					<PriceComparatorModal
						isOpen={isComparatorOpen}
						onClose={() => setIsComparatorOpen(false)}
						onTransferToCalculator={handleTransferFromModal}
						theme={theme}
						onPlayClick={playClick}
						onPlayConfirm={playResult}
					/>
				)}

				{isFuelOpen && (
					<FuelCalculatorModal
						isOpen={isFuelOpen}
						onClose={() => setIsFuelOpen(false)}
						onTransferToCalculator={handleTransferFromModal}
						theme={theme}
						onPlayClick={playClick}
						onPlayConfirm={playResult}
					/>
				)}

				{isDiscountOpen && (
					<DiscountProfitModal
						isOpen={isDiscountOpen}
						initialAmount={getLastNumber() || ""}
						onClose={() => setIsDiscountOpen(false)}
						onTransferToCalculator={handleTransferFromModal}
						theme={theme}
						onPlayClick={playClick}
						onPlayConfirm={playResult}
					/>
				)}

				{isConverterOpen && (
					<ConverterModal
						isOpen={isConverterOpen}
						initialValue={getLastNumber() || "1"}
						onClose={() => setIsConverterOpen(false)}
						onTransferToCalculator={handleTransferFromModal}
						theme={theme}
						onPlayClick={playClick}
					/>
				)}

				{isSplitBillOpen && (
					<SplitBillModal
						isOpen={isSplitBillOpen}
						initialAmount={getLastNumber() || ""}
						onClose={() => setIsSplitBillOpen(false)}
						onTransferToCalculator={handleTransferFromModal}
						theme={theme}
						onPlayClick={playClick}
						onPlayConfirm={playResult}
					/>
				)}

				{isFinanceOpen && (
					<FinanceModal
						isOpen={isFinanceOpen}
						initialAmount={getLastNumber() || ""}
						onClose={() => setIsFinanceOpen(false)}
						onTransferToCalculator={handleTransferFromModal}
						theme={theme}
						onPlayClick={playClick}
						onPlayConfirm={playResult}
					/>
				)}

				{isReceiptImageOpen && (
					<ReceiptImageModal
						isOpen={isReceiptImageOpen}
						onClose={() => setIsReceiptImageOpen(false)}
						history={history}
						theme={theme}
						onPlayClick={playClick}
					/>
				)}

				{isAnalyticsOpen && (
					<SpendingDashboardModal
						isOpen={isAnalyticsOpen}
						onClose={() => setIsAnalyticsOpen(false)}
						history={history}
						theme={theme}
						onPlayClick={playClick}
					/>
				)}

				{isThemePickerOpen && (
					<ThemePickerModal
						isOpen={isThemePickerOpen}
						onClose={() => setIsThemePickerOpen(false)}
						currentTheme={theme}
						allThemes={allThemes}
						onSelectTheme={setTheme}
						colorMode={colorMode}
						onToggleColorMode={toggleColorMode}
						onPlayClick={playClick}
					/>
				)}

				{isHelpOpen && (
					<HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} theme={theme} />
				)}

				{isBackupOpen && (
					<BackupModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} theme={theme} />
				)}

				{isPixOpen && (
					<PixDonationModal isOpen={isPixOpen} onClose={() => setIsPixOpen(false)} theme={theme} />
				)}

				{isLegalOpen && (
					<PrivacyPolicyModal
						isOpen={isLegalOpen}
						onClose={() => setIsLegalOpen(false)}
						initialTab={legalInitialTab}
						theme={theme}
					/>
				)}

				{isScannerOpen && (
					<BarcodeScannerModal
						isOpen={isScannerOpen}
						onClose={() => setIsScannerOpen(false)}
						onAddProduct={(unitPrice, qty, name) => applyQuantity(unitPrice, qty, name)}
						theme={theme}
						onPlayBeep={playScannerBeep}
						onPlayClick={playClick}
					/>
				)}
			</Suspense>

			{/* Notificações Toast do shadcn/ui */}
			<Toaster />
		</div>
	);
}
