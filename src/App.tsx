import { AnimatePresence, motion, useTransform } from "framer-motion";
import { Delete, ShoppingBag } from "lucide-react";
import { useCallback, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import {
	BackupModal,
	CalculatorButton,
	DiscountProfitModal,
	Display,
	FuelCalculatorModal,
	HelpModal,
	HistoryPanel,
	type IslandNotification,
	KeyboardShortcutsModal,
	PriceComparatorModal,
	ProductNameModal,
	QuantityModal,
	QuickToolsPanel,
	ReceiptImageModal,
	SplitBillModal,
	TopNavigation,
} from "@/features/calculator/components";
import { BASIC_BUTTONS, SCIENTIFIC_FUNCTIONS } from "@/features/calculator/constants";
import {
	use3dCardTilt,
	useCalculator,
	useHapticFeedback,
	useKeyboard,
	useSoundFeedback,
	useThemes,
	useVoiceInput,
} from "@/features/calculator/hooks";
import { formatNumberPtBR } from "@/features/calculator/utils/format";
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

export function App() {
	const [showHistory, setShowHistory] = useState(false);
	const [isAdvanced, setIsAdvanced] = useState(false);
	const [isCompactMode, setIsCompactMode] = useState(false);
	const [islandNotification, setIslandNotification] = useState<IslandNotification | null>(null);
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
	const [isProductNameModalOpen, setIsProductNameModalOpen] = useState(false);
	const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
	const [isComparatorOpen, setIsComparatorOpen] = useState(false);
	const [isConverterOpen, setIsConverterOpen] = useState(false);
	const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
	const [isFinanceOpen, setIsFinanceOpen] = useState(false);
	const [isFuelOpen, setIsFuelOpen] = useState(false);
	const [isDiscountOpen, setIsDiscountOpen] = useState(false);
	const [isReceiptImageOpen, setIsReceiptImageOpen] = useState(false);
	const [activeKey, setActiveKey] = useState<string | null>(null);

	const { theme, allThemes, setTheme, colorMode, toggleColorMode } = useThemes();
	const { isMuted, toggleMute, playClick, playOperator, playResult, playDelete, playScannerBeep } =
		useSoundFeedback();
	const { triggerHaptic } = useHapticFeedback(true);
	const { isInstallable, installApp } = usePwaInstall();
	const { isActive: isWakeLockActive, toggleWakeLock } = useWakeLock();

	// 3D Parallax Tilt & Dynamic Spotlight Aura
	const {
		rotateX,
		rotateY,
		glareX,
		glareY,
		handleMouseMove,
		handleMouseEnter,
		handleMouseLeave,
	} = use3dCardTilt(6);

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
		setIslandNotification({
			id: Date.now(),
			type: "result",
			title: "Cálculo Concluído",
			subtitle: "Resultado pronto no visor",
		});
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

	// Atalhos Globais de Teclado
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

	// Reconhecimento de Voz Inteligente ("Falar para Somar")
	const {
		isListening: isListeningVoice,
		transcript: voiceTranscript,
		toggleListening: toggleVoice,
	} = useVoiceInput({
		onProductRecognized: (productName, unitPrice, quantity) => {
			applyQuantity(unitPrice, quantity, productName);
			const total = (Number(unitPrice.replace(",", ".")) || 0) * quantity;
			setIslandNotification({
				id: Date.now(),
				type: "item",
				title: `+ R$ ${formatNumberPtBR(total.toFixed(2))}`,
				subtitle: productName ? `${quantity}x ${productName}` : `${quantity} un`,
			});
		},
		onMathRecognized: (expression) => {
			handleTransferFromModal(expression);
			calculate();
			setIslandNotification({
				id: Date.now(),
				type: "result",
				title: "Cálculo por Voz Concluído",
				subtitle: expression,
			});
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
			setIslandNotification({
				id: Date.now(),
				type: "result",
				title: "Cálculo Concluído",
				subtitle: "Resultado pronto no visor",
			});
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
				className="w-full flex flex-col items-center justify-center py-6 sm:py-10 px-2 sm:px-4 md:px-6 perspective-3d"
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
								onOpenComparator={handleOpenComparator}
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

					{/* CARD PRINCIPAL DA CALCULADORA COM PARALLAX 3D TILT E SPOTLIGHT AURA */}
					<motion.section
						style={{
							rotateX,
							rotateY,
							transformStyle: "preserve-3d",
						}}
						onMouseMove={handleMouseMove}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
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
						{/* Camada de Reflexo Holográfico & Spotlight Aura que segue o cursor */}
						<motion.div
							className="absolute inset-0 pointer-events-none rounded-[inherit] z-10 opacity-60 transition-opacity duration-300"
							style={{
								background: useTransform(
									[glareX, glareY],
									([gx, gy]) =>
										`radial-gradient(circle 320px at ${gx}% ${gy}%, rgba(255,255,255,0.08), transparent 80%)`,
								),
							}}
						/>

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
							isPwaInstallable={isInstallable}
							onInstallPwa={installApp}
							currentTheme={theme}
							allThemes={allThemes}
							onSelectTheme={setTheme}
						/>

						{/* VISOR DISPLAY COM DYNAMIC ISLAND & QUANTUM SPARKS */}
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
							islandNotification={islandNotification}
						/>

						{/* BARRA DE AÇÃO RÁPIDA: ITEM & QUANTIDADE (MERCADO) */}
						<div className="my-2.5 px-0.5">
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
									py-2.5
									px-4
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
								<span className="font-semibold tracking-wide">
									Item & Quantidade
								</span>
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
					</motion.section>

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
				onOpenFuel={handleOpenFuel}
				onOpenDiscount={handleOpenDiscount}
			/>

			<SavingsGuideSection />

			<WhyUsSection theme={theme} />

			{/* FOOTER INSTITUCIONAL */}
			<SiteFooter theme={theme} onOpenPix={() => setIsPixOpen(true)} />

			{/* Banner discreto de instalação PWA */}
			<PwaInstallBanner isInstallable={isInstallable} onInstall={installApp} />

			{/* Modal de Atalhos de Teclado */}
			<KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />

			{/* Modal de Escolha do Nome do Produto, Preço e Quantidade (Supermercado) */}
			<ProductNameModal
				isOpen={isProductNameModalOpen}
				initialUnitPrice={getLastNumber() || ""}
				onClose={() => setIsProductNameModalOpen(false)}
				onConfirm={(unitPrice, qty, productName) => {
					applyQuantity(unitPrice, qty, productName);
					const total = (Number(unitPrice.replace(",", ".")) || 0) * qty;
					setIslandNotification({
						id: Date.now(),
						type: "item",
						title: `+ R$ ${formatNumberPtBR(total.toFixed(2))}`,
						subtitle: productName ? `${qty}x ${productName}` : `${qty} un`,
					});
				}}
				theme={theme}
				onPlayClick={playClick}
				onPlayConfirm={playScannerBeep}
			/>

			{/* Subtela / Modal de Quantidade Rápida */}
			<QuantityModal
				isOpen={isQuantityModalOpen}
				initialUnitPrice={getLastNumber() || ""}
				onClose={() => setIsQuantityModalOpen(false)}
				onConfirm={(unitPrice, qty, productName) => {
					applyQuantity(unitPrice, qty, productName);
					const total = (Number(unitPrice.replace(",", ".")) || 0) * qty;
					setIslandNotification({
						id: Date.now(),
						type: "item",
						title: `+ R$ ${formatNumberPtBR(total.toFixed(2))}`,
						subtitle: productName ? `${qty}x ${productName}` : `${qty} un`,
					});
				}}
				theme={theme}
				onPlayClick={playClick}
				onPlayConfirm={playScannerBeep}
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

			{/* Modal de Calculadora Flex (Etanol vs Gasolina) */}
			<FuelCalculatorModal
				isOpen={isFuelOpen}
				onClose={() => setIsFuelOpen(false)}
				onTransferToCalculator={handleTransferFromModal}
				theme={theme}
				onPlayClick={playClick}
				onPlayConfirm={playResult}
			/>

			{/* Modal de Calculadora de Descontos e Margem de Lucro */}
			<DiscountProfitModal
				isOpen={isDiscountOpen}
				initialAmount={getLastNumber() || ""}
				onClose={() => setIsDiscountOpen(false)}
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

			{/* Modal de Cupom Fiscal Digital em Imagem PNG */}
			<ReceiptImageModal
				isOpen={isReceiptImageOpen}
				onClose={() => setIsReceiptImageOpen(false)}
				history={history}
				theme={theme}
				onPlayClick={playClick}
			/>

			{/* Central de Ajuda & Guia de Uso */}
			<HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} theme={theme} />

			{/* Modal de Backup & Restauração JSON */}
			<BackupModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} theme={theme} />

			{/* Modal de Apoio PIX */}
			<PixDonationModal isOpen={isPixOpen} onClose={() => setIsPixOpen(false)} theme={theme} />

			{/* Notificações Toast do shadcn/ui */}
			<Toaster />
		</div>
	);
}
