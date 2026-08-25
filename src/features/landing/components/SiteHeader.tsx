import { memo, useState } from "react";
import {
	Coffee,
	Download,
	Menu,
	Moon,
	Sun,
	X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
		<header className="sticky top-0 z-40 w-full border-b border-white/8 backdrop-blur-xl bg-[#0b0d13]/80 html.light:bg-[#e6ebf4]/80 transition-colors">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
				{/* Logo e Nome */}
				<a
					href="#calculadora"
					className="flex items-center gap-2.5 group cursor-pointer"
				>
					<div className="relative">
						<img
							src="/logo.png"
							alt="SmartCalc Logo"
							className="w-8 h-8 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform"
						/>
						<div
							className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${theme.dotColor} shadow-[0_0_8px_currentColor] animate-pulse`}
						/>
					</div>
					<div>
						<div className="flex items-center gap-1.5">
							<span className="text-base font-bold text-white font-display tracking-tight">
								Smart<span className={theme.accentText}>Calc</span>
							</span>
							<span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
								v1.0
							</span>
						</div>
						<p className="text-[10px] text-zinc-400 -mt-0.5 hidden sm:block">
							Calculadora Inteligente & Finanças
						</p>
					</div>
				</a>

				{/* Links Desktop */}
				<nav className="hidden md:flex items-center gap-6">
					{navLinks.map((link) => (
						<a
							key={link.name}
							href={link.href}
							className="text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
						>
							{link.name}
						</a>
					))}
				</nav>

				{/* Ações Direitas */}
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
							rounded-2xl
							bg-amber-500/10
							hover:bg-amber-500/20
							border
							border-amber-500/30
							text-amber-300
							hover:text-amber-200
							text-xs
							font-semibold
							transition-all
							cursor-pointer
							active:scale-95
						"
					>
						<Coffee size={14} className="text-amber-400" />
						<span>Apoiar via PIX</span>
					</button>

					{/* Botão PWA se disponível */}
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
								rounded-2xl
								bg-cyan-500/10
								hover:bg-cyan-500/20
								border
								border-cyan-500/30
								text-cyan-300
								text-xs
								font-semibold
								transition-all
								cursor-pointer
								active:scale-95
							"
						>
							<Download size={14} />
							<span>Instalar App</span>
						</button>
					)}

					{/* Alternador Sol/Lua */}
					<button
						type="button"
						onClick={onToggleColorMode}
						title={colorMode === "dark" ? "Modo Claro" : "Modo Escuro"}
						className="p-2 rounded-2xl border border-white/10 bg-white/4 hover:bg-white/8 text-zinc-300 hover:text-white transition-all cursor-pointer"
					>
						{colorMode === "dark" ? (
							<Sun size={16} className="text-amber-400" />
						) : (
							<Moon size={16} className="text-cyan-400" />
						)}
					</button>

					{/* Menu Mobile */}
					<button
						type="button"
						onClick={() => setIsMobileMenuOpen((prev) => !prev)}
						className="md:hidden p-2 rounded-2xl border border-white/10 bg-white/4 text-zinc-300 hover:text-white cursor-pointer"
					>
						{isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
					</button>
				</div>
			</div>

			{/* Dropdown Mobile */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden border-b border-white/8 bg-[#0b0d13]/95 px-4 py-3 space-y-2"
					>
						{navLinks.map((link) => (
							<a
								key={link.name}
								href={link.href}
								onClick={() => setIsMobileMenuOpen(false)}
								className="block py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
							>
								{link.name}
							</a>
						))}

						<div className="pt-2 border-t border-white/8 flex items-center gap-2">
							<button
								type="button"
								onClick={() => {
									onOpenPix();
									setIsMobileMenuOpen(false);
								}}
								className="w-full py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2"
							>
								<Coffee size={14} />
								<span>Apoiar via PIX</span>
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
});
