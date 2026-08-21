import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function usePwaInstall() {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
	const [isInstallable, setIsInstallable] = useState(false);
	const [isInstalled, setIsInstalled] = useState(false);

	useEffect(() => {
		// Detecta se já está rodando como PWA instalado
		const isStandalone =
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as unknown as { standalone?: boolean }).standalone === true;

		if (isStandalone) {
			setIsInstalled(true);
			setIsInstallable(false);
			return;
		}

		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
			setIsInstallable(true);
		};

		const handleAppInstalled = () => {
			setIsInstalled(true);
			setIsInstallable(false);
			setDeferredPrompt(null);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);

		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);

	const installApp = useCallback(async () => {
		if (!deferredPrompt) {
			// Se o navegador não disparou o prompt nativo ainda (ex: iOS Safari ou Chrome desktop)
			alert(
				"Para instalar no celular/PC:\n1. Toque em 'Compartilhar' ou no menu do navegador (⋮)\n2. Selecione 'Adicionar à tela inicial' ou 'Instalar aplicativo'.",
			);
			return false;
		}

		try {
			await deferredPrompt.prompt();
			const choiceResult = await deferredPrompt.userChoice;
			if (choiceResult.outcome === "accepted") {
				setIsInstallable(false);
				setIsInstalled(true);
				setDeferredPrompt(null);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Erro ao instalar PWA:", error);
			return false;
		}
	}, [deferredPrompt]);

	return {
		isInstallable,
		isInstalled,
		installApp,
	};
}
