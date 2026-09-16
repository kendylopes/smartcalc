import { useCallback, useEffect, useState } from "react";
import { evaluateExpression } from "../logic/evaluate";
import type { HistoryItem } from "../types";

const MAX_EXPRESSION_LENGTH = 120;
const OPERATORS = ["+", "-", "*", "/"];

export const useCalculator = () => {
	const [value, setValue] = useState("");
	const [preview, setPreview] = useState("");
	const [isResult, setIsResult] = useState(false);
	const [history, setHistory] = useState<HistoryItem[]>([]);
	const [isLimitReached, setIsLimitReached] = useState(false);

	// Carregar histórico do localStorage
	useEffect(() => {
		try {
			const saved = localStorage.getItem("calculator-history");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					setHistory(parsed);
				}
			}
		} catch (error) {
			console.error("Erro ao carregar histórico:", error);
			localStorage.removeItem("calculator-history");
		}
	}, []);

	// Salvar histórico no localStorage
	useEffect(() => {
		try {
			localStorage.setItem("calculator-history", JSON.stringify(history));
		} catch (error) {
			console.error("Erro ao salvar histórico:", error);
		}
	}, [history]);

	// Live Preview inteligente
	const calculatePreview = useCallback((expression: string): string => {
		if (!expression) return "";

		const lastChar = expression.slice(-1);
		if (OPERATORS.includes(lastChar)) {
			return "";
		}

		// Verifica se há pelo menos uma operação binária (ex: 2+3 ou (2*3))
		const hasOperation = /[+\-*/]/.test(expression) || expression.includes("(");
		if (!hasOperation) return "";

		try {
			const result = evaluateExpression(expression);
			return result === "Error" || result === expression ? "" : result;
		} catch {
			return "";
		}
	}, []);

	const [undoStack, setUndoStack] = useState<string[]>([]);
	const [redoStack, setRedoStack] = useState<string[]>([]);

	const recordStateForUndo = useCallback((currentVal: string) => {
		setUndoStack((prev) => {
			if (prev.length > 0 && prev[prev.length - 1] === currentVal) return prev;
			const next = [...prev, currentVal];
			return next.length > 30 ? next.slice(next.length - 30) : next;
		});
		setRedoStack([]);
	}, []);

	const undo = useCallback(() => {
		setUndoStack((prevUndo) => {
			if (prevUndo.length === 0) return prevUndo;
			const previousVal = prevUndo[prevUndo.length - 1];
			const newUndo = prevUndo.slice(0, -1);

			setRedoStack((prevRedo) => [...prevRedo, value]);
			setValue(previousVal);
			setPreview(calculatePreview(previousVal));
			setIsResult(false);
			return newUndo;
		});
	}, [value, calculatePreview]);

	const redo = useCallback(() => {
		setRedoStack((prevRedo) => {
			if (prevRedo.length === 0) return prevRedo;
			const nextVal = prevRedo[prevRedo.length - 1];
			const newRedo = prevRedo.slice(0, -1);

			setUndoStack((prevUndo) => [...prevUndo, value]);
			setValue(nextVal);
			setPreview(calculatePreview(nextVal));
			setIsResult(false);
			return newRedo;
		});
	}, [value, calculatePreview]);

	// Entrada de caracteres
	const input = useCallback(
		(val: string) => {
			if (value.length >= MAX_EXPRESSION_LENGTH) {
				setIsLimitReached(true);
				setTimeout(() => {
					setIsLimitReached(false);
				}, 1200);
				return;
			}

			recordStateForUndo(value);

			const lastChar = value.slice(-1);

			// Pós resultado
			if (isResult) {
				if (OPERATORS.includes(val)) {
					const nextVal = value + val;
					setValue(nextVal);
					setIsResult(false);
					setPreview("");
					return;
				}
				const nextVal = val === "." ? "0." : val;
				setValue(nextVal);
				setPreview("");
				setIsResult(false);
				return;
			}

			// Porcentagem inteligente (Suporta padrão comercial brasileiro: 100 + 10% = 110)
			if (val === "%") {
				if (!value) return;

				// Identifica o último número
				const numMatch = value.match(/(\d+(\.\d+)?)$/);
				if (!numMatch) return;

				const currentNum = Number(numMatch[0]);
				const prefix = value.slice(0, -numMatch[0].length);
				const prevOp = prefix.slice(-1);

				// Se há operador anterior (+ ou -), calcula porcentagem sobre a base anterior
				if (prevOp === "+" || prevOp === "-") {
					const baseExpr = prefix.slice(0, -1);
					const baseVal = Number(evaluateExpression(baseExpr));

					if (!Number.isNaN(baseVal)) {
						const percentVal = (baseVal * currentNum) / 100;
						const nextVal = prefix + String(percentVal);
						setValue(nextVal);
						setPreview(calculatePreview(nextVal));
						return;
					}
				}

				// Caso padrão: divide por 100
				const percent = String(currentNum / 100);
				const nextVal = prefix + percent;
				setValue(nextVal);
				setPreview(calculatePreview(nextVal));
				return;
			}

			// Operadores (+, -, *, /)
			if (OPERATORS.includes(val)) {
				if (value === "") {
					if (val === "-") {
						setValue("-");
					}
					return;
				}

				// Evita operadores duplicados substituindo o anterior
				if (OPERATORS.includes(lastChar)) {
					if (val === "-" && lastChar !== "-") {
						const nextVal = value + val;
						setValue(nextVal);
					} else {
						const nextVal = value.slice(0, -1) + val;
						setValue(nextVal);
					}
				} else {
					const nextVal = value + val;
					setValue(nextVal);
				}

				setPreview("");
				return;
			}

			// Ponto / Vírgula decimal
			if (val === ".") {
				if (value === "" || OPERATORS.includes(lastChar) || lastChar === "(") {
					const nextVal = `${value}0.`;
					setValue(nextVal);
					setPreview(calculatePreview(nextVal));
					return;
				}

				const parts = value.split(/[+\-*/(]/);
				const lastNumber = parts[parts.length - 1];
				if (lastNumber.includes(".")) return;
			}

			// Número normal ou parênteses
			const nextVal = value === "0" && val !== "." ? val : value + val;
			setValue(nextVal);
			setPreview(calculatePreview(nextVal));
		},
		[value, isResult, calculatePreview, recordStateForUndo],
	);

	// Limpar tudo
	const clear = useCallback(() => {
		if (value) {
			recordStateForUndo(value);
		}
		setPreview("");
		setValue("");
		setIsResult(false);
	}, [value, recordStateForUndo]);

	// Apagar último dígito
	const deleteLast = useCallback(() => {
		if (!value) return;

		recordStateForUndo(value);
		const nextVal = value.slice(0, -1);
		setValue(nextVal);

		if (nextVal === "") {
			setPreview("");
			return;
		}

		setPreview(calculatePreview(nextVal));
	}, [value, calculatePreview, recordStateForUndo]);

	// Alternar sinal (+/-)
	const toggleSign = useCallback(() => {
		if (!value) return;

		recordStateForUndo(value);
		if (/^-?\d+(\.\d+)?$/.test(value)) {
			const next = value.startsWith("-") ? value.slice(1) : `-${value}`;
			setValue(next);
			setPreview(calculatePreview(next));
			return;
		}

		const match = value.match(/([+\-*/])?(-?\d+(\.\d+)?)$/);
		if (match && match.index !== undefined) {
			const lastNum = match[2];
			const prefix = value.slice(0, match.index);
			const op = match[1] || "";

			let updated = "";
			if (lastNum.startsWith("-")) {
				updated = prefix + op + lastNum.slice(1);
			} else {
				updated = `${prefix + op}-${lastNum}`;
			}
			setValue(updated);
			setPreview(calculatePreview(updated));
		}
	}, [value, calculatePreview, recordStateForUndo]);

	// Calcular resultado final
	const calculate = useCallback(() => {
		if (!value) return;

		try {
			const expression = String(value);
			const result = String(evaluateExpression(expression));

			if (result === "Error") {
				setPreview("");
				return;
			}

			recordStateForUndo(value);

			setHistory((prev) => [
				{
					id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
					expression,
					result,
					timestamp: Date.now(),
				},
				...prev,
			]);

			setPreview("");
			setValue(result);
			setIsResult(true);
		} catch {
			setPreview("");
		}
	}, [value, recordStateForUndo]);

	// Atualizar item completo do histórico (nome, quantidade, preço unitário)
	const updateHistoryItem = useCallback(
		(
			id: string,
			updates: {
				productName?: string;
				quantity?: number;
				unitPrice?: number;
				tag?: string;
			},
		) => {
			setHistory((prev) =>
				prev.map((item) => {
					if (item.id !== id) return item;

					const newQty = updates.quantity !== undefined ? updates.quantity : item.quantity;
					const newUnitPrice = updates.unitPrice !== undefined ? updates.unitPrice : item.unitPrice;
					const newProductName =
						updates.productName !== undefined ? updates.productName.trim() : item.productName;
					const newTag = updates.tag !== undefined ? updates.tag : item.tag;

					let newExpression = item.expression;
					let newResult = item.result;

					if (newQty !== undefined && newUnitPrice !== undefined) {
						const subtotal = Math.round(newUnitPrice * newQty * 100) / 100;
						newResult = String(subtotal);
						newExpression = `${newUnitPrice} * ${newQty}`;
					}

					return {
						...item,
						productName: newProductName,
						quantity: newQty,
						unitPrice: newUnitPrice,
						tag: newTag,
						expression: newExpression,
						result: newResult,
					};
				}),
			);
		},
		[],
	);

	// Atualizar etiqueta de um item do histórico
	const updateHistoryItemTag = useCallback((id: string, tag?: string) => {
		setHistory((prev) =>
			prev.map((item) => (item.id === id ? { ...item, tag: tag?.trim() || undefined } : item)),
		);
	}, []);

	// Funções científicas
	const applySquareRoot = useCallback(() => {
		if (!value) return;
		try {
			const currentVal = isResult ? value : evaluateExpression(value);
			if (currentVal !== "Error") {
				const num = Number(currentVal);
				if (num < 0) {
					setIsLimitReached(true);
					setTimeout(() => setIsLimitReached(false), 1200);
					return;
				}
				recordStateForUndo(value);
				const res = String(Math.round((Math.sqrt(num) + Number.EPSILON) * 1e10) / 1e10);
				setValue(res);
				setPreview("");
				setIsResult(true);
			}
		} catch {
			// Ignore
		}
	}, [value, isResult, recordStateForUndo]);

	const applySquare = useCallback(() => {
		if (!value) return;
		try {
			const currentVal = isResult ? value : evaluateExpression(value);
			if (currentVal !== "Error") {
				const num = Number(currentVal);
				recordStateForUndo(value);
				const res = String(Math.round((num * num + Number.EPSILON) * 1e10) / 1e10);
				setValue(res);
				setPreview("");
				setIsResult(true);
			}
		} catch {
			// Ignore
		}
	}, [value, isResult, recordStateForUndo]);

	const applyInverse = useCallback(() => {
		if (!value) return;
		try {
			const currentVal = isResult ? value : evaluateExpression(value);
			if (currentVal !== "Error") {
				const num = Number(currentVal);
				if (num === 0) return;
				recordStateForUndo(value);
				const res = String(Math.round((1 / num + Number.EPSILON) * 1e10) / 1e10);
				setValue(res);
				setPreview("");
				setIsResult(true);
			}
		} catch {
			// Ignore
		}
	}, [value, isResult, recordStateForUndo]);

	const applyPi = useCallback(() => {
		input("π");
	}, [input]);

	// Histórico
	const selectFromHistory = useCallback(
		(res: string) => {
			if (value) recordStateForUndo(value);
			setValue(res);
			setPreview("");
			setIsResult(false);
		},
		[value, recordStateForUndo],
	);

	const deleteHistoryItem = useCallback((id: string) => {
		setHistory((prev) => prev.filter((item) => item.id !== id));
	}, []);

	const clearHistory = useCallback(() => {
		setHistory([]);
		try {
			localStorage.removeItem("calculator-history");
		} catch (e) {
			console.error(e);
		}
	}, []);

	// Multiplicador de quantidade (compras e produtos)
	const getLastNumber = useCallback((): string => {
		if (isResult) return value;
		if (!value) return "";

		const match = value.match(/(-?\d+(\.\d+)?)$/);
		return match ? match[1] : "";
	}, [isResult, value]);

	const applyQuantity = useCallback(
		(unitPriceStr: string, quantity: number, productName?: string) => {
			if (!unitPriceStr || quantity <= 0) return;

			const cleanPrice = unitPriceStr.replace(/\./g, "").replace(",", ".");
			const priceNum = Number(cleanPrice);
			if (Number.isNaN(priceNum)) return;

			recordStateForUndo(value);

			const itemSubtotal = Math.round(priceNum * quantity * 100) / 100;
			const itemTerm = String(itemSubtotal);

			let nextVal = value;

			if (isResult || value === "") {
				nextVal = itemTerm;
			} else {
				const lastNumMatch = value.match(/(-?\d+(\.\d+)?)$/);
				if (lastNumMatch) {
					const lastNum = lastNumMatch[1];
					nextVal = value.slice(0, -lastNum.length) + itemTerm;
				} else if (OPERATORS.includes(value.slice(-1))) {
					nextVal = value + itemTerm;
				} else {
					nextVal = `${value}+${itemTerm}`;
				}
			}

			const finalProductName = productName ? productName.trim() : "Sem nome";

			// Registra o item individual no histórico de compras
			setHistory((prev) => [
				{
					id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
					expression: `${priceNum} * ${quantity}`,
					result: String(itemSubtotal),
					productName: finalProductName,
					quantity,
					unitPrice: priceNum,
					tag: "🛒 Supermercado",
					timestamp: Date.now(),
				},
				...prev,
			]);

			setValue(nextVal);
			setIsResult(false);
			setPreview(calculatePreview(nextVal));
		},
		[value, isResult, calculatePreview, recordStateForUndo],
	);

	return {
		value,
		preview,
		history,
		canUndo: undoStack.length > 0,
		canRedo: redoStack.length > 0,
		undo,
		redo,
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
		selectFromHistory,
		deleteHistoryItem,
		updateHistoryItem,
		updateHistoryItemTag,
		clearHistory,
		isLimitReached,
		isResult,
	};
};
