import { AnimatePresence, motion } from "framer-motion";
import { Database, Download, FileUp, Upload, X } from "lucide-react";
import { memo, useRef, useState } from "react";
import { toast } from "sonner";
import type { ThemeConfig } from "../hooks/useThemes";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onDataRestored?: () => void;
	theme?: ThemeConfig;
};

export const BackupModal = memo(function BackupModal({
	isOpen,
	onClose,
	onDataRestored,
	theme,
}: Props) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isRestoring, setIsRestoring] = useState(false);

	// Exportar dados como arquivo JSON
	const handleExportBackup = () => {
		try {
			const backupData = {
				version: "1.0",
				app: "SmartCalc",
				exportedAt: new Date().toISOString(),
				data: {
					history: localStorage.getItem("calculator-history"),
					budget: localStorage.getItem("smartcalc-budget"),
					theme: localStorage.getItem("calculator-theme"),
					colorMode: localStorage.getItem("calculator-color-mode"),
					soundEnabled: localStorage.getItem("calculator-sound-enabled"),
					hapticEnabled: localStorage.getItem("smartcalc-haptic-enabled"),
					keycapsEnabled: localStorage.getItem("smartcalc-keycaps"),
				},
			};

			const dataStr = JSON.stringify(backupData, null, 2);
			const blob = new Blob([dataStr], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			const dateStr = new Date().toISOString().slice(0, 10);
			link.href = url;
			link.download = `smartcalc-backup-${dateStr}.json`;
			link.click();
			URL.revokeObjectURL(url);

			toast.success("Backup gerado com sucesso!", {
				description: `smartcalc-backup-${dateStr}.json salvo no dispositivo.`,
				icon: "💾",
			});
		} catch (err) {
			console.error(err);
			toast.error("Erro ao gerar backup de dados.");
		}
	};

	// Importar dados a partir de arquivo JSON
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsRestoring(true);
		const reader = new FileReader();

		reader.onload = (event) => {
			try {
				const content = event.target?.result as string;
				const parsed = JSON.parse(content);

				if (!parsed.app || parsed.app !== "SmartCalc" || !parsed.data) {
					throw new Error("Arquivo de backup inválido ou incompatível.");
				}

				// Restaura chaves
				const { data } = parsed;
				if (data.history !== undefined && data.history !== null) {
					localStorage.setItem("calculator-history", data.history);
				}
				if (data.budget !== undefined && data.budget !== null) {
					localStorage.setItem("smartcalc-budget", data.budget);
				}
				if (data.theme) {
					localStorage.setItem("calculator-theme", data.theme);
				}
				if (data.colorMode) {
					localStorage.setItem("calculator-color-mode", data.colorMode);
				}
				if (data.soundEnabled) {
					localStorage.setItem("calculator-sound-enabled", data.soundEnabled);
				}

				toast.success("Dados restaurados com sucesso!", {
					description: "Seus históricos, metas e configurações foram carregados.",
					icon: "✨",
				});

				onDataRestored?.();
				onClose();
				setTimeout(() => {
					window.location.reload();
				}, 600);
			} catch (err) {
				console.error(err);
				toast.error("Falha ao restaurar backup.", {
					description: "Verifique se o arquivo JSON selecionado é válido.",
				});
			} finally {
				setIsRestoring(false);
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
			}
		};

		reader.readAsText(file);
	};

	// Limpar todos os dados locais
	const handleClearAllStorage = () => {
		if (
			window.confirm(
				"Tem certeza de que deseja apagar todos os dados salvos (histórico e configurações)? Essa ação não pode ser desfeita.",
			)
		) {
			localStorage.clear();
			toast.info("Todos os dados locais foram apagados.");
			setTimeout(() => {
				window.location.reload();
			}, 500);
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-black/80 backdrop-blur-md"
					/>

					{/* Modal Card */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 15 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 15 }}
						transition={{ type: "spring", stiffness: 350, damping: 25 }}
						className="
							relative
							w-full
							max-w-md
							overflow-hidden
							rounded-[2.2rem]
							border
							border-white/10
							tech-modal
							p-4.5 sm:p-5.5
							shadow-[0_24px_70px_rgba(0,0,0,0.85)]
						"
					>
						{/* Header */}
						<div className="flex items-center justify-between pb-3 border-b border-white/8">
							<div className="flex items-center gap-2.5">
								<div
									className={`
										p-2
										rounded-2xl
										${theme?.operatorBgActive ?? "bg-cyan-500/10"}
										border
										${theme?.operatorBorderActive ?? "border-cyan-500/20"}
										${theme?.accentText ?? "text-cyan-400"}
									`}
								>
									<Database size={18} />
								</div>
								<div>
									<h2 className="text-sm font-bold text-white tracking-wide">
										Backup & Restauração
									</h2>
									<p className="text-[11px] text-zinc-400">
										Proteja seus dados ou transfira de aparelho
									</p>
								</div>
							</div>

							<button
								type="button"
								onClick={onClose}
								className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/8 transition-colors cursor-pointer"
							>
								<X size={16} />
							</button>
						</div>

						{/* Opções de Backup */}
						<div className="py-4 space-y-3">
							{/* Card de Exportação */}
							<div className="p-3.5 rounded-2xl bg-white/4 border border-white/8 space-y-2">
								<div className="flex items-center gap-2">
									<Download size={15} className={theme?.accentText ?? "text-cyan-400"} />
									<span className="text-xs font-semibold text-zinc-200">
										Exportar Backup (.JSON)
									</span>
								</div>
								<p className="text-[11px] text-zinc-400 leading-relaxed">
									Baixe um arquivo seguro com todos os seus históricos de cálculos, compras e metas
									definidas.
								</p>
								<button
									type="button"
									onClick={handleExportBackup}
									className={`
										w-full
										py-2.5
										rounded-xl
										flex
										items-center
										justify-center
										gap-2
										text-xs
										font-semibold
										${theme?.equalBg ?? "bg-cyan-400 text-black"}
										active:scale-98
										transition-all
										cursor-pointer
									`}
								>
									<Download size={13} />
									<span>Baixar Arquivo de Backup</span>
								</button>
							</div>

							{/* Card de Importação */}
							<div className="p-3.5 rounded-2xl bg-white/4 border border-white/8 space-y-2">
								<div className="flex items-center gap-2">
									<Upload size={15} className="text-purple-400" />
									<span className="text-xs font-semibold text-zinc-200">Restaurar Backup</span>
								</div>
								<p className="text-[11px] text-zinc-400 leading-relaxed">
									Selecione um arquivo `.json` gerado anteriormente para recuperar seus dados no
									app.
								</p>

								<input
									ref={fileInputRef}
									type="file"
									accept=".json"
									onChange={handleFileChange}
									className="hidden"
								/>

								<button
									type="button"
									disabled={isRestoring}
									onClick={() => fileInputRef.current?.click()}
									className="
										w-full
										py-2.5
										rounded-xl
										flex
										items-center
										justify-center
										gap-2
										text-xs
										font-semibold
										bg-white/8
										hover:bg-white/12
										text-zinc-200
										border
										border-white/10
										active:scale-98
										transition-all
										cursor-pointer
										disabled:opacity-50
									"
								>
									<FileUp size={13} />
									<span>{isRestoring ? "Processando..." : "Selecionar Arquivo JSON"}</span>
								</button>
							</div>

							{/* Reset / Limpeza */}
							<div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500">
								<span>Deseja recomeçar do zero?</span>
								<button
									type="button"
									onClick={handleClearAllStorage}
									className="text-red-400 hover:text-red-300 hover:underline cursor-pointer transition-colors"
								>
									Limpar todos os dados
								</button>
							</div>
						</div>

						{/* Footer */}
						<div className="pt-3 border-t border-white/8">
							<button
								type="button"
								onClick={onClose}
								className="
									w-full
									py-2.5
									rounded-xl
									bg-white/6
									hover:bg-white/10
									text-zinc-300
									hover:text-white
									text-xs
									font-medium
									border
									border-white/8
									transition-all
									cursor-pointer
								"
							>
								Fechar
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});
