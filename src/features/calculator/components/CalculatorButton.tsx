import { motion } from "framer-motion";
import { memo, type ReactNode } from "react";
import type { ThemeConfig } from "../hooks/useThemes";

type Props = {
	label: string;
	onClick: () => void;
	variant?: "default" | "operator" | "equal" | "scientific" | "action";
	active?: boolean;
	isActive?: boolean;
	disabled?: boolean;
	size?: "normal" | "compact";
	icon?: ReactNode;
	showKeycap?: boolean;
	theme?: ThemeConfig;
};

const KEYCAP_MAP: Record<string, string> = {
	C: "Esc",
	Del: "⌫",
	"=": "↵",
	"/": "/",
	"*": "*",
	"-": "-",
	"+": "+",
	"%": "%",
	".": ",",
	"0": "0",
	"1": "1",
	"2": "2",
	"3": "3",
	"4": "4",
	"5": "5",
	"6": "6",
	"7": "7",
	"8": "8",
	"9": "9",
	"√": "r",
	"x²": "s",
	π: "p",
	"(": "(",
	")": ")",
};

export const CalculatorButton = memo(function CalculatorButton({
	label,
	onClick,
	variant,
	active = false,
	isActive = false,
	disabled = false,
	size = "normal",
	icon,
	showKeycap = false,
	theme,
}: Props) {
	const isCompact = size === "compact";
	const isButtonActive = active || isActive;

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		// Remove o foco persistente pós-clique para não travar o anel de foco visual
		e.currentTarget.blur();
		onClick();
	};

	// Determina a variante automaticamente se não for passada
	const resolvedVariant =
		variant ||
		(label === "="
			? "equal"
			: ["+", "-", "*", "/", "%", "+/-"].includes(label)
				? "operator"
				: ["C", "Del"].includes(label)
					? "action"
					: ["√", "x²", "π", "1/x", "(", ")"].includes(label)
						? "scientific"
						: "default");

	const getNeuClasses = () => {
		switch (resolvedVariant) {
			case "operator":
				return isButtonActive
					? `neu-btn-operator-active ${theme?.operatorText ?? "text-cyan-300"}`
					: `neu-btn-operator ${theme?.operatorText ?? "text-cyan-300"}`;

			case "equal":
				return isButtonActive
					? `neu-btn-equal ${theme?.equalBg ?? "bg-cyan-400 text-black font-semibold"}`
					: `neu-btn-equal ${theme?.equalBg ?? "bg-cyan-400 text-black font-semibold"}`;

			case "action":
				return isButtonActive
					? "neu-btn-action text-red-400 neu-btn-pressed"
					: "neu-btn-action text-zinc-300";

			case "scientific":
				return isButtonActive
					? "neu-btn-operator-active text-white"
					: "neu-btn-operator text-zinc-300";

			default: // Números (0-9, .)
				return isButtonActive
					? "neu-btn-default text-white neu-btn-pressed"
					: "neu-btn-default text-white";
		}
	};

	const getAriaLabel = () => {
		switch (label) {
			case "C":
				return "Limpar tudo";
			case "Del":
				return "Apagar último caractere";
			case "=":
				return "Calcular resultado";
			case "+/-":
				return "Alternar sinal positivo ou negativo";
			case "+":
				return "Somar";
			case "-":
				return "Subtrair";
			case "*":
				return "Multiplicar";
			case "/":
				return "Dividir";
			case "%":
				return "Porcentagem";
			case ".":
				return "Vírgula decimal";
			case "√":
				return "Raiz quadrada";
			case "x²":
				return "Elevar ao quadrado";
			case "π":
				return "Constante Pi";
			case "1/x":
				return "Inverso";
			case "(":
				return "Abrir parênteses";
			case ")":
				return "Fechar parênteses";
			default:
				return `Número ${label}`;
		}
	};

	const getDisplayLabel = (lbl: string) => {
		switch (lbl) {
			case "*":
				return "×";
			case "/":
				return "÷";
			case "-":
				return "−";
			case ".":
				return ",";
			default:
				return lbl;
		}
	};

	const keycap = KEYCAP_MAP[label];

	return (
		<motion.button
			type="button"
			onClick={handleClick}
			disabled={disabled}
			aria-label={getAriaLabel()}
			whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
			whileTap={disabled ? {} : { scale: 0.94, y: 1 }}
			transition={{
				type: "spring",
				stiffness: 500,
				damping: 28,
				mass: 0.5,
			}}
			className={`
				group
				relative
				overflow-hidden
				${isCompact ? "h-10 sm:h-12 rounded-[1.1rem] sm:rounded-[1.2rem] text-sm font-medium" : "h-13 xs:h-14 sm:h-17.5 rounded-[1.3rem] sm:rounded-[1.8rem] text-xl sm:text-2xl font-light"}
				w-full
				flex
				items-center
				justify-center
				select-none
				outline-none
				focus:outline-none
				transform-gpu
				transition-all
				duration-150
				${getNeuClasses()}
				${disabled ? "opacity-35 cursor-not-allowed" : "cursor-pointer"}
			`}
		>
			{/* Reflexo Especular de Vidro Cristal (Sheen de Luz Superior) */}
			<div className="absolute inset-x-0 top-0 h-[48%] rounded-t-[inherit] bg-gradient-to-b from-white/18 via-white/6 to-transparent pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-200" />

			{/* Micro-brilho radial de refração no clique */}
			<div className="absolute inset-0 rounded-[inherit] bg-radial from-white/10 to-transparent opacity-0 group-active:opacity-100 pointer-events-none transition-opacity duration-150" />

			{/* Borda interna de refração fina */}
			<div className="absolute inset-px rounded-[calc(1.3rem-1px)] sm:rounded-[calc(1.8rem-1px)] border border-white/10 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-200" />

			{/* Legenda visual do atalho de teclado (Keycap Pro) - Apenas em desktop com teclado físico */}
			{showKeycap && keycap && (
				<span className="hidden md:block absolute top-1.5 right-2 text-[9px] font-mono text-zinc-400 group-hover:text-zinc-200 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none select-none z-20">
					{keycap}
				</span>
			)}

			{/* Rótulo do botão ou ícone */}
			<motion.span
				className={`
					relative
					z-10
					flex
					items-center
					justify-center
					${isCompact ? "font-normal" : "font-light tracking-tight"}
				`}
				animate={isButtonActive ? { scale: 0.94 } : { scale: 1 }}
				transition={{ duration: 0.08 }}
			>
				{icon ?? getDisplayLabel(label)}
			</motion.span>
		</motion.button>
	);
});
