import { AnimatePresence, motion } from "framer-motion";
import {
	Bell,
	ChevronDown,
	Coffee,
	Download,
	Menu,
	Moon,
	Search,
	Sun,
	X,
	Zap,
} from "lucide-react";
import { memo, useState } from "react";
import type { ColorMode, ThemeConfig } from "@/features/calculator/hooks/useThemes";

type Props = {
	colorMode: ColorMode;
	onToggleColorMode: () => void;
	onOpenPix: () => void;
	onOpenShortcuts?: () => void;
	isPwaInstallable?: boolean;
	onInstallPwa?: () => void;
	theme: ThemeConfig;
};

export const SiteHeader = memo(function SiteHeader({
	colorMode,
	onToggleColorMode,
	onOpenPix,
	onOpenShortcuts,
	isPwaInstallable,
	onInstallPwa,
	theme,
}: Props) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("Calculadora");

	const navLinks = [
		{ id: "Calculadora", name: "Calculadora", href: "#calculadora" },
		{ id: "Recursos", name: "Recursos", href: "#recursos" },
		{ id: "Dicas", name: "Dicas", href: "#dicas" },
		{ id: "Diferenciais", name: "Diferenciais", href: "#diferenciais" },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b border-white/[0.08] backdrop-blur-2xl bg-[#080b11]/85 html.light:bg-[#e6ebf4]/90 transition-colors shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
			<div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
				{/* 1. LADO ESQUERDO: Brand & Logo com Ícone Estilizado */}
				<a
					href="#calculadora"
					onClick={() => setActiveTab("Calculadora")}
					className="flex items-center gap-2.5 group cursor-pointer select-none shrink-0"
				>
					<div className="relative">
						<img
							src="/logo.png"
							alt="SmartCalc Logo"
							className="w-8 h-8 rounded-xl shadow-[0_0_16px_rgba(34,211,238,0.3)] border border-white/15 group-hover:scale-105 transition-transform duration-200 object-cover"
						/>
					</div>
					<span className="text-base font-bold text-white font-display tracking-tight flex items-center gap-0.5">
						Smart<span className={theme.accentText}>Calc</span>
					</span>
				</a>

				{/* 2. CENTRO: Segmented Glass Pill Capsules (Estilo idêntico à referência) */}
				<nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-black/40 border border-white/[0.08] backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
					{navLinks.map((link) => {
						const isActive = activeTab === link.id;
						return (
							<a
								key={link.id}
								href={link.href}
								onClick={() => setActiveTab(link.id)}
								className={`
									relative
									px-4
									py-1.5
									rounded-full
									text-xs
									font-semibold
									tracking-wide
									transition-all
									duration-200
									cursor-pointer
									select-none
									flex
									items-center
									justify-center
									${
										isActive
											? "text-white bg-gradient-to-r from-[#ff5e3a] to-[#ff3b20] shadow-[0_0_18px_rgba(255,87,34,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-white/20"
											: "text-zinc-300 hover:text-white bg-gradient-to-b from-white/[0.08] to-white/[0.02] hover:from-white/[0.14] hover:to-white/[0.05] border border-white/[0.12] hover:border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]"
									}
								`}
							>
								{link.name}
							</a>
						);
					})}
				</nav>

				{/* 3. LADO DIREITO: Botões Circulares de Vidro + Cápsula de Status do Usuário */}
				<div className="flex items-center gap-2">
					{/* Botão Circular: Atalhos / Busca (Estilo Vidro Redondo) */}
					{onOpenShortcuts && (
						<button
							type="button"
							onClick={onOpenShortcuts}
							title="Atalhos de teclado (Pressione '?' ou clique)"
							aria-label="Atalhos de teclado"
							className="
								hidden sm:flex
								items-center
								justify-center
								w-8
								h-8
								rounded-full
								bg-gradient-to-b
								from-white/[0.08]
								to-white/[0.02]
								hover:from-white/[0.14]
								hover:to-white/[0.05]
								border
								border-white/[0.12]
								hover:border-white/25
								text-zinc-300
								hover:text-white
								shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]
								transition-all
								cursor-pointer
								active:scale-95
							"
						>
							<Search size={13} />
						</button>
					)}

					{/* Botão Circular: Apoio PIX com Indicador Notificação Neon */}
					<button
						type="button"
						onClick={onOpenPix}
						title="Apoiar o projeto via PIX"
						aria-label="Apoiar o projeto via PIX"
						className="
							relative
							flex
							items-center
							justify-center
							w-8
							h-8
							rounded-full
							bg-gradient-to-b
							from-white/[0.08]
							to-white/[0.02]
							hover:from-amber-500/20
							hover:to-amber-500/5
							border
							border-white/[0.12]
							hover:border-amber-500/40
							text-zinc-300
							hover:text-amber-300
							shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]
							transition-all
							cursor-pointer
							active:scale-95
						"
					>
						<Bell size={13} />
						{/* Ponto de notificação verde como na referência */}
						<span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] border border-black" />
					</button>

					{/* Botão Circular: Modo Claro / Escuro */}
					<button
						type="button"
						onClick={onToggleColorMode}
						title={colorMode === "dark" ? "Modo Claro" : "Modo Escuro"}
						aria-label={colorMode === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
						className="
							flex
							items-center
							justify-center
							w-8
							h-8
							rounded-full
							bg-gradient-to-b
							from-white/[0.08]
							to-white/[0.02]
							hover:from-white/[0.14]
							hover:to-white/[0.05]
							border
							border-white/[0.12]
							hover:border-white/25
							text-zinc-300
							hover:text-white
							shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]
							transition-all
							cursor-pointer
							active:scale-95
						"
					>
						{colorMode === "dark" ? (
							<Sun size={13} className="text-amber-400" />
						) : (
							<Moon size={13} className="text-cyan-400" />
						)}
					</button>

					{/* Cápsula de Status / App Badge (Inspirado no card 'Alex Carter' da referência) */}
					<div
						onClick={isPwaInstallable && onInstallPwa ? onInstallPwa : onOpenPix}
						className="
							hidden sm:flex
							items-center
							gap-2.5
							pl-1.5
							pr-3
							py-1
							rounded-full
							bg-gradient-to-b
							from-white/[0.08]
							to-white/[0.02]
							hover:from-white/[0.12]
							hover:to-white/[0.04]
							border
							border-white/[0.14]
							hover:border-white/25
							shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_6px_rgba(0,0,0,0.4)]
							transition-all
							cursor-pointer
							select-none
							active:scale-98
						"
					>
						{/* Mini Avatar / Ícone Laranja / Fogo com Glow */}
						<div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#ff5e3a] to-[#ff9f43] flex items-center justify-center text-white shadow-[0_0_10px_rgba(255,94,58,0.4)]">
							<Zap size={11} className="fill-white" />
						</div>

						{/* Textos da Cápsula */}
						<div className="flex flex-col text-left leading-none">
							<span className="text-[11px] font-bold text-white tracking-tight">
								SmartCalc PRO
							</span>
							<span className="text-[9px] font-medium text-zinc-400 tracking-wide mt-0.5">
								{isPwaInstallable ? "Instalar PWA" : "Modo Offline"}
							</span>
						</div>

						<ChevronDown size={11} className="text-zinc-400 ml-0.5" />
					</div>

					{/* Botão Menu Mobile */}
					<button
						type="button"
						onClick={() => setIsMobileMenuOpen((prev) => !prev)}
						aria-label="Abrir menu de navegação"
						className="
							md:hidden
							p-2
							rounded-full
							bg-gradient-to-b
							from-white/[0.08]
							to-white/[0.02]
							border
							border-white/[0.12]
							text-zinc-300
							hover:text-white
							cursor-pointer
							active:scale-95
						"
					>
						{isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
					</button>
				</div>
			</div>

			{/* Dropdown Mobile Suave em Estilo Glass */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="md:hidden border-b border-white/[0.08] bg-[#080b11]/95 backdrop-blur-2xl px-4 py-3 space-y-2 overflow-hidden"
					>
						<div className="grid grid-cols-2 gap-1.5">
							{navLinks.map((link) => {
								const isActive = activeTab === link.id;
								return (
									<a
										key={link.id}
										href={link.href}
										onClick={() => {
											setActiveTab(link.id);
											setIsMobileMenuOpen(false);
										}}
										className={`
											block
											px-3
											py-2
											rounded-xl
											text-xs
											font-semibold
											text-center
											transition-all
											${
												isActive
													? "text-white bg-gradient-to-r from-[#ff5e3a] to-[#ff3b20] shadow-[0_0_12px_rgba(255,87,34,0.4)]"
													: "text-zinc-300 bg-white/[0.04] border border-white/[0.08]"
											}
										`}
									>
										{link.name}
									</a>
								);
							})}
						</div>

						<div className="pt-2 border-t border-white/[0.08] flex items-center gap-2">
							<button
								type="button"
								onClick={() => {
									onOpenPix();
									setIsMobileMenuOpen(false);
								}}
								className="w-full py-2 px-3 rounded-full bg-white/[0.04] hover:bg-amber-500/10 border border-white/[0.08] text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
							>
								<Coffee size={13} className="text-amber-400" />
								<span>Apoiar via PIX</span>
							</button>

							{isPwaInstallable && onInstallPwa && (
								<button
									type="button"
									onClick={() => {
										onInstallPwa();
										setIsMobileMenuOpen(false);
									}}
									className="w-full py-2 px-3 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
								>
									<Download size={13} />
									<span>Instalar App</span>
								</button>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
});

