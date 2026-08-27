import { AnimatePresence, motion } from "framer-motion";
import { Coffee, Download, Menu, Moon, Sun, X } from "lucide-react";
import { memo, useState } from "react";
import type { ColorMode, ThemeConfig } from "@/features/calculator/hooks/useThemes";

type Props = {
	colorMode: ColorMode;
	onToggleColorMode: () => void;
	onOpenPix: () => void;
	isPwaInstallable?: boolean;
	onInstallPwa?: () => void;
	theme: ThemeConfig;
};

export const SiteHeader = memo(function SiteHeader({
	colorMode,
	onToggleColorMode,
	onOpenPix,
	isPwaInstallable,
	onInstallPwa,
	theme,
}: Props) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navLinks = [
		{ name: "Calculadora", href: "#calculadora" },
		{ name: "Recursos", href: "#recursos" },
		{ name: "Dicas de Economia", href: "#dicas" },
		{ name: "Diferenciais", href: "#diferenciais" },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b border-white/[0.06] backdrop-blur-2xl bg-[#0b0d13]/80 html.light:bg-[#e6ebf4]/85 transition-colors">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 sm:h-16 flex items-center justify-between">
				{/* 1. Logo & Nome da Marca */}
				<a
					href="#calculadora"
					className="flex items-center gap-2.5 group cursor-pointer select-none"
				>
					<img
						src="/logo.png"
						alt="SmartCalc Logo"
						className="w-8 h-8 rounded-xl shadow-[0_0_16px_rgba(34,211,238,0.25)] border border-white/10 group-hover:scale-105 transition-transform duration-200"
					/>
					<span className="text-base font-bold text-white font-display tracking-tight">
						Smart<span className={theme.accentText}>Calc</span>
					</span>
				</a>

				{/* 2. Navegação Flutuante Central (Pill Design Moderno) */}
				<nav className="hidden md:flex items-center gap-1 px-1.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
					{navLinks.map((link) => (
						<a
							key={link.name}
							href={link.href}
							className="px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-150 cursor-pointer"
						>
							{link.name}
						</a>
					))}
				</nav>

				{/* 3. Ações do Lado Direito (Design Coeso & Padronizado) */}
				<div className="flex items-center gap-2">
					{/* Botão de Apoio PIX */}
					<button
						type="button"
						onClick={onOpenPix}
						className="
							hidden sm:flex
							items-center
							gap-1.5
							px-3
							py-1.5
							rounded-full
							bg-white/[0.04]
							hover:bg-amber-500/10
							border
							border-white/[0.08]
							hover:border-amber-500/30
							text-zinc-300
							hover:text-amber-300
							text-xs
							font-medium
							transition-all
							duration-150
							cursor-pointer
							active:scale-95
						"
					>
						<Coffee size={13} className="text-amber-400" />
						<span>Apoiar</span>
					</button>

					{/* Botão Instalar App (PWA) */}
					{isPwaInstallable && onInstallPwa && (
						<button
							type="button"
							onClick={onInstallPwa}
							className="
								hidden sm:flex
								items-center
								gap-1.5
								px-3
								py-1.5
								rounded-full
								bg-cyan-500/10
								hover:bg-cyan-500/20
								border
								border-cyan-500/30
								text-cyan-300
								text-xs
								font-medium
								transition-all
								duration-150
								cursor-pointer
								active:scale-95
								shadow-[0_0_12px_rgba(6,182,212,0.15)]
							"
						>
							<Download size={13} />
							<span>Instalar</span>
						</button>
					)}

					{/* Alternador Modo Claro / Escuro */}
					<button
						type="button"
						onClick={onToggleColorMode}
						title={colorMode === "dark" ? "Modo Claro" : "Modo Escuro"}
						aria-label={colorMode === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
						className="p-2 rounded-full border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all cursor-pointer active:scale-95"
					>
						{colorMode === "dark" ? (
							<Sun size={15} className="text-amber-400" />
						) : (
							<Moon size={15} className="text-cyan-400" />
						)}
					</button>

					{/* Menu Mobile */}
					<button
						type="button"
						onClick={() => setIsMobileMenuOpen((prev) => !prev)}
						aria-label="Abrir menu de navegação"
						className="md:hidden p-2 rounded-full border border-white/[0.08] bg-white/[0.04] text-zinc-300 hover:text-white cursor-pointer active:scale-95"
					>
						{isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
					</button>
				</div>
			</div>

			{/* Dropdown Mobile Suave */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="md:hidden border-b border-white/[0.06] bg-[#0b0d13]/95 backdrop-blur-xl px-4 py-3 space-y-1 overflow-hidden"
					>
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								onClick={() => setIsMobileMenuOpen(false)}
								className="block px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors"
							>
								{link.name}
							</a>
						))}

						<div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
							<button
								type="button"
								onClick={() => {
									onOpenPix();
									setIsMobileMenuOpen(false);
								}}
								className="w-full py-2 px-3 rounded-full bg-white/[0.04] hover:bg-amber-500/10 border border-white/[0.08] text-amber-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
							>
								<Coffee size={14} className="text-amber-400" />
								<span>Apoiar via PIX</span>
							</button>

							{isPwaInstallable && onInstallPwa && (
								<button
									type="button"
									onClick={() => {
										onInstallPwa();
										setIsMobileMenuOpen(false);
									}}
									className="w-full py-2 px-3 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
								>
									<Download size={14} />
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
