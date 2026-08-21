import { useCallback, useEffect, useState } from "react";

export function useWakeLock() {
	const [isSupported, setIsSupported] = useState(false);
	const [isActive, setIsActive] = useState(false);
	const [wakeLockSentinel, setWakeLockSentinel] = useState<WakeLockSentinel | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined" && "wakeLock" in navigator) {
			setIsSupported(true);
		}
	}, []);

	// Reativa se a aba voltar a ficar visível
	useEffect(() => {
		const handleVisibilityChange = async () => {
			if (isActive && document.visibilityState === "visible" && "wakeLock" in navigator) {
				try {
					const sentinel = await navigator.wakeLock.request("screen");
					setWakeLockSentinel(sentinel);
				} catch {
					// Ignora
				}
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
	}, [isActive]);

	const toggleWakeLock = useCallback(async () => {
		if (!("wakeLock" in navigator)) {
			alert("O recurso de manter tela acesa não é suportado pelo seu navegador atual.");
			return;
		}

		if (isActive && wakeLockSentinel) {
			try {
				await wakeLockSentinel.release();
				setWakeLockSentinel(null);
				setIsActive(false);
			} catch (e) {
				console.error(e);
			}
		} else {
			try {
				const sentinel = await navigator.wakeLock.request("screen");
				sentinel.addEventListener("release", () => {
					setIsActive(false);
					setWakeLockSentinel(null);
				});
				setWakeLockSentinel(sentinel);
				setIsActive(true);
			} catch (err) {
				console.error("Erro ao ativar WakeLock:", err);
			}
		}
	}, [isActive, wakeLockSentinel]);

	return {
		isSupported,
		isActive,
		toggleWakeLock,
	};
}
