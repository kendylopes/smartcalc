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
			whileTap={disabled ? {} : { scale: 0.96 }}
			transition={{
				type: "spring",
				stiffness: 450,
				damping: 25,
				mass: 0.6,
			}}
			className={`
				group
				relative
				${isCompact ? "h-11 sm:h-12 rounded-[1.2rem] text-sm font-medium" : "h-15 sm:h-18 rounded-[1.6rem] sm:rounded-[1.8rem] text-xl sm:text-2xl font-light"}
				w-full
				flex
				items-center
				justify-center
				select-none
				outline-none
				focus:outline-none
				transform-gpu
				transition-all
				duration-100
				${getNeuClasses()}
				${disabled ? "opacity-35 cursor-not-allowed" : "cursor-pointer"}
			`}
		>
			{/* Legenda visual do atalho de teclado (Keycap Pro) */}
			{showKeycap && keycap && (
				<span className="absolute top-1.5 right-2 text-[9px] font-mono text-zinc-500 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none select-none">
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
				animate={isButtonActive ? { scale: 0.96 } : { scale: 1 }}
				transition={{ duration: 0.08 }}
			>
				{icon ?? getDisplayLabel(label)}
			</motion.span>
		</motion.button>
	);
});
