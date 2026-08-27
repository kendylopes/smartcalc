import { useEffect } from "react";

type Props = {
	input: (val: string) => void;
	calculate: () => void;
	clear: () => void;
	deleteLast: () => void;
	setActiveKey: (key: string | null) => void;
	openQuantity?: () => void;
	openConverter?: () => void;
	openSplitBill?: () => void;
	openFinance?: () => void;
	openComparator?: () => void;
	openAnalytics?: () => void;
	openHelp?: () => void;
};

export const useKeyboard = ({
	input,
	calculate,
	clear,
	deleteLast,
	setActiveKey,
	openQuantity,
	openConverter,
	openSplitBill,
	openFinance,
	openComparator,
	openAnalytics,
	openHelp,
}: Props) => {
	useEffect(() => {
		const triggerActive = (keyName: string) => {
			setActiveKey(keyName);
			setTimeout(() => {
				setActiveKey(null);
			}, 80);
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			// Ignora atalhos globais se o foco estiver dentro de um campo de texto/input
			if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
				return;
			}

			const key = event.key;

			// Números 0-9
			if (/^[0-9]$/.test(key)) {
				triggerActive(key);
				input(key);
				return;
			}

			// Vírgula no padrão PT-BR ou ponto
			if (key === "." || key === ",") {
				triggerActive(".");
				input(".");
				return;
			}

			// Multiplicador de quantidade com tecla 'q' / 'Q'
			if (key.toLowerCase() === "q" && openQuantity) {
				event.preventDefault();
				openQuantity();
				return;
			}

			// Estatísticas & Gráficos com tecla 'g' / 'G'
			if (key.toLowerCase() === "g" && openAnalytics) {
				event.preventDefault();
				openAnalytics();
				return;
			}

			// Comparador de preços com tecla 'p' / 'P'
			if (key.toLowerCase() === "p" && openComparator) {
				event.preventDefault();
				openComparator();
				return;
			}

			// Ajuda & Manual com tecla 'h' / 'H'
			if (key.toLowerCase() === "h" && openHelp) {
				event.preventDefault();
				openHelp();
				return;
			}

			// Conversor de moedas & unidades com tecla 'u' / 'U'
			if (key.toLowerCase() === "u" && openConverter) {
				event.preventDefault();
				openConverter();
				return;
			}

			// Divisor de contas com tecla 's' / 'S'
			if (key.toLowerCase() === "s" && openSplitBill) {
				event.preventDefault();
				openSplitBill();
				return;
			}

			// Simulador financeiro com tecla 'f' / 'F'
			if (key.toLowerCase() === "f" && openFinance) {
				event.preventDefault();
				openFinance();
				return;
			}

			// Multiplicação por 'x' ou '*'
			if (key === "*" || key.toLowerCase() === "x") {
				triggerActive("*");
				input("*");
				return;
			}

			// Operadores padrão (+, -, /) e porcentagem (%)
			if (["+", "-", "/", "%"].includes(key)) {
				triggerActive(key);
				input(key);
				return;
			}

			// Calcular com Enter ou '='
			if (key === "Enter" || key === "=") {
				event.preventDefault();
				triggerActive("=");
				calculate();
				return;
			}

			// Apagar último dígito com Backspace ou Delete
			if (key === "Backspace" || key === "Delete") {
				triggerActive("Del");
				deleteLast();
				return;
			}

			// Limpar com Escape ou tecla 'c'/'C'
			if (key === "Escape" || key.toLowerCase() === "c") {
				triggerActive("C");
				clear();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [
		input,
		calculate,
		clear,
		deleteLast,
		setActiveKey,
		openQuantity,
		openComparator,
		openAnalytics,
		openHelp,
		openConverter,
		openSplitBill,
		openFinance,
	]);
};
