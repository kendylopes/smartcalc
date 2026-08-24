import { useCallback } from "react";

export type HapticType = "click" | "operator" | "result" | "delete" | "success" | "error";

export function useHapticFeedback(enabled: boolean = true) {
	const triggerHaptic = useCallback(
		(type: HapticType = "click") => {
			if (!enabled || typeof window === "undefined" || !("vibrate" in navigator)) {
				return;
			}

			try {
				switch (type) {
					case "click":
						navigator.vibrate(10);
						break;
					case "operator":
						navigator.vibrate(14);
						break;
					case "result":
						navigator.vibrate([15, 35, 20]);
						break;
					case "delete":
						navigator.vibrate(22);
						break;
					case "success":
						navigator.vibrate([10, 30, 15]);
						break;
					case "error":
						navigator.vibrate([40, 40, 40]);
						break;
					default:
						navigator.vibrate(10);
				}
			} catch {
				// Silencia caso o navegador bloqueie a vibração
			}
		},
		[enabled],
	);

	return { triggerHaptic };
}
