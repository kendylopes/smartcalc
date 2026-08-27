import { useCallback, useRef, useState } from "react";

export type SoundProfile = "scifi" | "modern" | "mechanical";

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

	const [soundProfile, setSoundProfile] = useState<SoundProfile>(() => {
		try {
			const saved = localStorage.getItem("smartcalc-sound-profile") as SoundProfile;
			return saved || "scifi";
		} catch {
			return "scifi";
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
				// Ignora bloqueio temporário
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

	const changeSoundProfile = useCallback((profile: SoundProfile) => {
		setSoundProfile(profile);
		try {
			localStorage.setItem("smartcalc-sound-profile", profile);
		} catch (e) {
			console.error(e);
		}
	}, []);

	// Clique de Teclas (com suporte a Perfil Sci-Fi / Modern / Mechanical)
	const playClick = useCallback(() => {
		triggerHaptic(8);
		if (isMuted) return;
		try {
			const ctx = getAudioContext();
			if (!ctx) return;

			const now = ctx.currentTime;

			if (soundProfile === "scifi") {
				// Sci-Fi Glass Tap (Apple VisionOS / Cyber UI)
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = "sine";
				osc.frequency.setValueAtTime(880, now); // A5
				osc.frequency.exponentialRampToValueAtTime(220, now + 0.025);

				gain.gain.setValueAtTime(0.04, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start(now);
				osc.stop(now + 0.03);
			} else {
				// Modern / Mechanical
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = "sine";
				osc.frequency.setValueAtTime(520, now);
				osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

				gain.gain.setValueAtTime(0.05, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start(now);
				osc.stop(now + 0.04);
			}
		} catch {
			// Ignora falhas de áudio
		}
	}, [isMuted, soundProfile, getAudioContext]);

	// Tom dos operadores
	const playOperator = useCallback(() => {
		triggerHaptic(12);
		if (isMuted) return;
		try {
			const ctx = getAudioContext();
			if (!ctx) return;

			const now = ctx.currentTime;
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			if (soundProfile === "scifi") {
				osc.type = "triangle";
				osc.frequency.setValueAtTime(1200, now);
				osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);
				gain.gain.setValueAtTime(0.05, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
			} else {
				osc.type = "triangle";
				osc.frequency.setValueAtTime(680, now);
				osc.frequency.exponentialRampToValueAtTime(340, now + 0.05);
				gain.gain.setValueAtTime(0.07, now);
				gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
			}

			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(now);
			osc.stop(now + 0.05);
		} catch {
			// Ignora
		}
	}, [isMuted, soundProfile, getAudioContext]);

	// Acorde de resolução de cálculo '='
	const playResult = useCallback(() => {
		triggerHaptic(20);
		if (isMuted) return;
		try {
			const ctx = getAudioContext();
			if (!ctx) return;

			const now = ctx.currentTime;
			const freqs =
				soundProfile === "scifi"
					? [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6 (Holographic Arpeggio)
					: [523.25, 659.25, 783.99];

			freqs.forEach((freq, index) => {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();

				osc.type = soundProfile === "scifi" ? "sine" : "triangle";
				const startTime = now + index * 0.025;
				osc.frequency.setValueAtTime(freq, startTime);

				gain.gain.setValueAtTime(0, startTime);
				gain.gain.linearRampToValueAtTime(0.04, startTime + 0.01);
				gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

				osc.connect(gain);
				gain.connect(ctx.destination);

				osc.start(startTime);
				osc.stop(startTime + 0.22);
			});
		} catch {
			// Ignora
		}
	}, [isMuted, soundProfile, getAudioContext]);

	// Delete / Limpar
	const playDelete = useCallback(() => {
		triggerHaptic(12);
		if (isMuted) return;
		try {
			const ctx = getAudioContext();
			if (!ctx) return;

			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			const now = ctx.currentTime;

			osc.type = "sine";
			osc.frequency.setValueAtTime(440, now);
			osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

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

	// Scanner Beep / Caixa de Mercado
	const playScannerBeep = useCallback(() => {
		triggerHaptic(25);
		if (isMuted) return;
		try {
			const ctx = getAudioContext();
			if (!ctx) return;

			const now = ctx.currentTime;

			// Tom 1: Beep de scanner laser de alta precisão
			const osc1 = ctx.createOscillator();
			const gain1 = ctx.createGain();
			osc1.type = "sine";
			osc1.frequency.setValueAtTime(2400, now);
			osc1.frequency.setValueAtTime(3200, now + 0.035);

			gain1.gain.setValueAtTime(0.07, now);
			gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

			osc1.connect(gain1);
			gain1.connect(ctx.destination);
			osc1.start(now);
			osc1.stop(now + 0.09);

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
		soundProfile,
		changeSoundProfile,
		playClick,
		playOperator,
		playResult,
		playDelete,
		playScannerBeep,
		triggerHaptic,
	};
}
