import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { parseVoiceCommand } from "../utils/voiceParser";

// Tipagem global para SpeechRecognition
interface IWindowSpeech extends Window {
	SpeechRecognition?: any;
	webkitSpeechRecognition?: any;
}

type Props = {
	onProductRecognized?: (productName: string, unitPrice: string, quantity: number) => void;
	onMathRecognized?: (expression: string) => void;
	onPriceRecognized?: (price: string) => void;
	onPlaySuccess?: () => void;
	onPlayError?: () => void;
};

export function useVoiceInput({
	onProductRecognized,
	onMathRecognized,
	onPriceRecognized,
	onPlaySuccess,
	onPlayError,
}: Props = {}) {
	const [isListening, setIsListening] = useState(false);
	const [transcript, setTranscript] = useState("");
	const recognitionRef = useRef<any>(null);

	const isSupported =
		typeof window !== "undefined" &&
		Boolean(
			(window as unknown as IWindowSpeech).SpeechRecognition ||
				(window as unknown as IWindowSpeech).webkitSpeechRecognition,
		);

	useEffect(() => {
		if (!isSupported) return;

		const SpeechRecognition =
			(window as unknown as IWindowSpeech).SpeechRecognition ||
			(window as unknown as IWindowSpeech).webkitSpeechRecognition;

		const recognition = new SpeechRecognition();
		recognition.lang = "pt-BR";
		recognition.continuous = false;
		recognition.interimResults = true;
		recognition.maxAlternatives = 1;

		recognition.onstart = () => {
			setIsListening(true);
			setTranscript("");
		};

		recognition.onresult = (event: any) => {
			const current = event.resultIndex;
			const text = event.results[current][0].transcript;
			setTranscript(text);

			// Se for resultado final
			if (event.results[current].isFinal) {
				const parsed = parseVoiceCommand(text);
				if (parsed) {
					onPlaySuccess?.();
					if (parsed.type === "product" && onProductRecognized) {
						onProductRecognized(parsed.productName, parsed.unitPrice, parsed.quantity);
						toast.success(
							`🛒 Adicionado: ${parsed.quantity}x ${parsed.productName} (R$ ${parsed.unitPrice})`,
							{
								description: `Subtotal: R$ ${(parsed.subtotal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
							},
						);
					} else if (parsed.type === "math" && onMathRecognized) {
						onMathRecognized(parsed.expression);
						toast.success(`🧮 Conta reconhecida: ${parsed.expression}`);
					} else if (parsed.type === "price" && onPriceRecognized) {
						onPriceRecognized(parsed.price);
						toast.success(`💵 Preço reconhecido: R$ ${parsed.price}`);
					}
				} else {
					toast.info(`Voz: "${text}"`, {
						description: 'Dica: Fale "2 leites a 4,50" ou "50 mais 25"',
					});
				}
			}
		};

		recognition.onerror = (event: any) => {
			setIsListening(false);
			if (event.error !== "no-speech" && event.error !== "aborted") {
				onPlayError?.();
				toast.error("Não foi possível captar a voz. Tente falar novamente.");
			}
		};

		recognition.onend = () => {
			setIsListening(false);
		};

		recognitionRef.current = recognition;

		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.abort();
			}
		};
	}, [
		isSupported,
		onProductRecognized,
		onMathRecognized,
		onPriceRecognized,
		onPlaySuccess,
		onPlayError,
	]);

	const startListening = useCallback(() => {
		if (!isSupported) {
			toast.error("Reconhecimento de voz não suportado neste navegador.");
			return;
		}

		if (recognitionRef.current) {
			try {
				recognitionRef.current.start();
			} catch {
				recognitionRef.current.abort();
				setTimeout(() => {
					recognitionRef.current?.start();
				}, 100);
			}
		}
	}, [isSupported]);

	const stopListening = useCallback(() => {
		if (recognitionRef.current && isListening) {
			recognitionRef.current.stop();
		}
	}, [isListening]);

	const toggleListening = useCallback(() => {
		if (isListening) {
			stopListening();
		} else {
			startListening();
		}
	}, [isListening, startListening, stopListening]);

	return {
		isListening,
		transcript,
		isSupported,
		startListening,
		stopListening,
		toggleListening,
	};
}
