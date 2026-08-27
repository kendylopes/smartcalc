import { useCallback, useRef, useState } from "react";

// Feedback Háptico suave para dispositivos móveis
const triggerHaptic = (durationMs = 12) => {
	if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
		try {
			navigator.vibrate(durationMs);
		} catch {
			// Ignora
		}
	}
};

export function useSoundFeedback() {
	const [isMuted, setIsMuted] = useState<boolean>(() => {
		try {
			const saved = localStorage.getItem("calculator-sound-muted");
			return saved !== null ? JSON.parse(saved) : false;
		} catch {
			return false;
		}
	});

	const audioCtxRef = useRef<AudioContext | null>(null);

	const getAudioContext = useCallback(() => {
		if (typeof window === "undefined") return null;

		if (!audioCtxRef.current) {
			const AudioCtx =
				window.AudioContext ||
				(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			if (AudioCtx) {
				audioCtxRef.current = new AudioCtx();
			}
		}

		if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
			audioCtxRef.current.resume().catch(() => {
				// Ignora bloqueio temporário antes de clique do usuário
			});
		}

		return audioCtxRef.current;
	}, []);

	const toggleMute = useCallback(() => {
		setIsMuted((prev) => {
			const next = !prev;
			try {
				localStorage.setItem("calculator-sound-muted", JSON.stringify(next));
			} catch (e) {
				console.error(e);
			}
			return next;
		});
	}, []);

	// Clique mecânico limpo e suave para números
	const playClick = useCallback(() => {
		triggerHaptic(10);
		if (isMuted) return;
		try {
			const ctx = getAudioContext();
			if (!ctx) return;

			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = "sine";
			const now = ctx.currentTime;
			osc.frequency.setValueAtTime(520, now);
			osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

			gain.gain.setValueAtTime(0.05, now);
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start(now);
			osc.stop(now + 0.04);
		} catch {
			// Ignora falhas de áudio silenciosamente
		}
	}, [isMuted, getAudioContext]);

	// Tom mais brilhante para operadores
	const playOperator = useCallback(() => {
		triggerHaptic(14);
		if (isMuted) return;
		try {
			const ctx = getAudioContext();
			if (!ctx) return;

			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = "triangle";
			const now = ctx.currentTime;
			osc.frequency.setValueAtTime(680, now);
			osc.frequency.exponentialRampToValueAtTime(340, now + 0.05);

			gain.gain.setValueAtTime(0.07, now);
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start(now);
			osc.stop(now + 0.055);
		} catch {
			// Ignora
		}
	}, [isMuted, getAudioContext]);

	// Acorde elegante e melódico para resultado '='
	const playResult = useCallback(() => {
		triggerHaptic(20);
		if (isMuted) return;
		try {
			const ctx = getAudioContext();
			if (!ctx) return;

			const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
			const now = ctx.currentTime;

			freqs.forEach((freq, index) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();

				osc.type = "sine";
				const startTime = now + index * 0.02;
				osc.frequency.setValueAtTime(freq, startTime);

				gain.gain.setValueAtTime(0, startTime);
				gain.gain.linearRampToValueAtTime(0.04, startTime + 0.01);
				gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

				osc.connect(gain);
				gain.connect(ctx.destination);

				osc.start(startTime);
				osc.stop(startTime + 0.2);
			});
		} catch {
			// Ignora
		}
	}, [isMuted, getAudioContext]);

	// Toque suave para delete/clear
	const playDelete = useCallback(() => {
		triggerHaptic(12);
		if (isMuted) return;
		try {
			const ctx = getAudioContext();
			if (!ctx) return;

			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = "sine";
			const now = ctx.currentTime;
			osc.frequency.setValueAtTime(360, now);
			osc.frequency.exponentialRampToValueAtTime(90, now + 0.04);

			gain.gain.setValueAtTime(0.06, now);
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start(now);
			osc.stop(now + 0.045);
		} catch {
			// Ignora
		}
	}, [isMuted, getAudioContext]);

	// Efeito sonoro satisfatório de Scanner de Código de Barras / Caixa Registradora para itens
	const playScannerBeep = useCallback(() => {
		triggerHaptic(25);
		if (isMuted) return;
		try {
			const ctx = getAudioContext();
			if (!ctx) return;

			const now = ctx.currentTime;

			// Tom 1: Beep de scanner de alta frequência
			const osc1 = ctx.createOscillator();
			const gain1 = ctx.createGain();
			osc1.type = "sine";
			osc1.frequency.setValueAtTime(2200, now);
			osc1.frequency.setValueAtTime(2800, now + 0.04);

			gain1.gain.setValueAtTime(0.08, now);
			gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

			osc1.connect(gain1);
			gain1.connect(ctx.destination);
			osc1.start(now);
			osc1.stop(now + 0.1);

			// Tom 2: Chime harmônico de caixa registradora sutil
			const osc2 = ctx.createOscillator();
			const gain2 = ctx.createGain();
			osc2.type = "triangle";
			osc2.frequency.setValueAtTime(1046.5, now + 0.03); // C6
			gain2.gain.setValueAtTime(0.04, now + 0.03);
			gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

			osc2.connect(gain2);
			gain2.connect(ctx.destination);
			osc2.start(now + 0.03);
			osc2.stop(now + 0.25);
		} catch {
			// Ignora
		}
	}, [isMuted, getAudioContext]);

	return {
		isMuted,
		toggleMute,
		playClick,
		playOperator,
		playResult,
		playDelete,
		playScannerBeep,
		triggerHaptic,
	};
}
