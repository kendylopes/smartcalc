import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Delete, History, ShoppingBag } from "lucide-react";

import {
	CalculatorButton,
	Display,
	HelpModal,
	HistoryPanel,
	KeyboardShortcutsModal,
	PriceComparatorModal,
	QuantityModal,
	SplitBillModal,
	TopNavigation,
} from "@/features/calculator/components";
import { BASIC_BUTTONS, SCIENTIFIC_FUNCTIONS } from "@/features/calculator/constants";
import {
	useCalculator,
	useKeyboard,
	useSoundFeedback,
	useThemes,
} from "@/features/calculator/hooks";
import { ConverterModal } from "@/features/converter";
import { FinanceModal } from "@/features/finance";
import { PwaInstallBanner, usePwaInstall, useWakeLock } from "@/features/pwa";

export function App() {
	const [showHistory, setShowHistory] = useState(false);
	const [isAdvanced, setIsAdvanced] = useState(false);
	const [isCompactMode, setIsCompactMode] = useState(false);
	const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
	const [isHelpOpen, setIsHelpOpen] = useState(false);
	const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
	const [isComparatorOpen, setIsComparatorOpen] = useState(false);
	const [isConverterOpen, setIsConverterOpen] = useState(false);
	const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
	const [isFinanceOpen, setIsFinanceOpen] = useState(false);
	const [activeKey, setActiveKey] = useState<string | null>(null);

	const { theme, allThemes, setTheme } = useThemes();
	const { isMuted, toggleMute, playClick, playOperator, playResult, playDelete } =
		useSoundFeedback();
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

	const handleKeyboardInput = useCallback(
		(k: string) => {
			playClick();
			input(k);
		},
		[playClick, input],
	);

	const handleKeyboardCalculate = useCallback(() => {
		playResult();
		calculate();
	}, [playResult, calculate]);

	const handleKeyboardClear = useCallback(() => {
		playDelete();
		clear();
	}, [playDelete, clear]);

	const handleKeyboardDeleteLast = useCallback(() => {
		playDelete();
		deleteLast();
	}, [playDelete, deleteLast]);

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

	useKeyboard({
		input: handleKeyboardInput,
		calculate: handleKeyboardCalculate,
		clear: handleKeyboardClear,
		deleteLast: handleKeyboardDeleteLast,
		setActiveKey,
		openQuantity: handleOpenQuantity,
		openComparator: handleOpenComparator,
		openHelp: handleOpenHelp,
		openConverter: handleOpenConverter,
		openSplitBill: handleOpenSplitBill,
		openFinance: handleOpenFinance,
	});

	const handleClick = useCallback(
		(val: string) => {
			setActiveKey(val);
			setTimeout(() => {
				setActiveKey(null);
			}, 70);

			if (val === "C") {
				playDelete();
				return clear();
			}

			if (val === "Del") {
				playDelete();
				return deleteLast();
			}

			if (val === "+/-") {
				playOperator();
				return toggleSign();
			}

			if (val === "=") {
				playResult();
				return calculate();
			}

			if (["+", "-", "*", "/"].includes(val)) {
				playOperator();
				return input(val);
			}

			playClick();
			input(val);
		},
		[clear, deleteLast, toggleSign, calculate, input, playClick, playOperator, playResult, playDelete],
	);

	const handleTransferFromModal = useCallback(
		(val: string) => {
			playResult();
			input(val);
		},
		[input, playResult],
	);

	return (
		<main className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-4 bg-ambient text-foreground transition-colors duration-300 font-sans overflow-x-hidden">
			{/* CONTAINER PRINCIPAL */}
			<div
				className={`
					relative
					w-full
					flex
					flex-col
					md:flex-row
					items-center
					md:items-stretch
					justify-center
					gap-3.5
					sm:gap-4.5
					transition-all
					duration-300
					${isCompactMode ? "max-w-76" : "max-w-95 md:max-w-4xl"}
				`}
			>
				{/* CALCULADORA CARD NEUMÓRFICO */}
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
						isWakeLockActive={isWakeLockActive}
						onToggleWakeLock={toggleWakeLock}
						isCompactMode={isCompactMode}
						onToggleCompactMode={() => setIsCompactMode((prev) => !prev)}
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
									showHistory
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
											onClick={() => {
												playOperator();
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
								theme={theme}
							/>
						))}
					</div>
				</section>

				{/* HISTÓRICO PANEL CARD NEUMÓRFICO COM ANIMAÇÃO */}
				<AnimatePresence>
					{showHistory && !isCompactMode && (
						<motion.aside
							initial={{ opacity: 0, x: 20, scale: 0.98 }}
							animate={{ opacity: 1, x: 0, scale: 1 }}
							exit={{ opacity: 0, x: 20, scale: 0.98 }}
							transition={{ duration: 0.2 }}
							className="relative w-full max-w-90 sm:max-w-95 md:w-76 overflow-hidden rounded-[2.4rem] neu-panel p-4 sm:p-4.5 flex flex-col justify-between"
						>
							<HistoryPanel
								history={history}
								theme={theme}
								onClose={() => setShowHistory(false)}
								onSelect={(res) => {
									playClick();
									selectFromHistory(res);
								}}
								onDelete={(id) => {
									playDelete();
									deleteHistoryItem(id);
								}}
								onUpdateTag={updateHistoryItemTag}
								onClearAll={() => {
									playDelete();
									clearHistory();
								}}
							/>
						</motion.aside>
					)}
				</AnimatePresence>
			</div>

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
		</main>
	);
}
