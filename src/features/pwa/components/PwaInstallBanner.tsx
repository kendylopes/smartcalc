import { memo, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Sparkles, X } from "lucide-react";

type Props = {
	isInstallable: boolean;
	onInstall: () => void;
};

export const PwaInstallBanner = memo(function PwaInstallBanner({
	isInstallable,
	onInstall,
}: Props) {
	const [isDismissed, setIsDismissed] = useState(false);

	useEffect(() => {
		const dismissed = localStorage.getItem("pwa-banner-dismissed");
		if (dismissed) {
			setIsDismissed(true);
		}
	}, []);

	const handleDismiss = () => {
		setIsDismissed(true);
		localStorage.setItem("pwa-banner-dismissed", "true");
	};

	if (!isInstallable || isDismissed) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 20 }}
				className="
					fixed
					bottom-4
					left-1/2
					-translate-x-1/2
					z-40
					w-[calc(100%-2rem)]
					max-w-md
					p-3
					rounded-2xl
					bg-zinc-900/95
					border
					border-cyan-500/30
					tech-modal
					shadow-[0_12px_40px_rgba(0,0,0,0.85)]
					flex
					items-center
					justify-between
					gap-3
				"
			>
				<div className="flex items-center gap-2.5 min-w-0">
					<img
						src="/logo.png"
						alt="Smart Calc"
						className="w-8 h-8 rounded-xl shadow-[0_0_10px_rgba(6,182,212,0.4)] shrink-0 object-cover"
					/>
					<div className="min-w-0">
						<p className="text-xs font-semibold text-white truncate flex items-center gap-1">
							<span>Instalar SmartCalc</span>
							<Sparkles size={11} className="text-cyan-400" />
						</p>
						<p className="text-[11px] text-zinc-400 truncate">Use offline como app nativo</p>
					</div>
				</div>

				<div className="flex items-center gap-1.5 shrink-0">
					<button
						type="button"
						onClick={onInstall}
						className="
							px-3
							py-1.5
							rounded-xl
							bg-cyan-400
							hover:bg-cyan-300
							text-black
							text-xs
							font-semibold
							flex
							items-center
							gap-1
							transition-all
							active:scale-95
							cursor-pointer
						"
					>
						<Download size={13} />
						<span>Instalar</span>
					</button>

					<button
						type="button"
						onClick={handleDismiss}
						className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
						title="Dispensar aviso"
					>
						<X size={14} />
					</button>
				</div>
			</motion.div>
		</AnimatePresence>
	);
});
