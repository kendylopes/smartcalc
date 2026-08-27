import { motion } from "framer-motion";
import { AlertCircle, Edit2, Plus, Target, Trash2, X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import type { ThemeConfig } from "../hooks/useThemes";
import {
	formatCurrencyInput,
	formatInitialPrice,
	formatNumberPtBR,
	parseCurrencyToNumber,
} from "../utils/format";

type Props = {
	currentTotal: number;
	theme?: ThemeConfig;
};

export const BudgetBar = memo(function BudgetBar({ currentTotal }: Props) {
	const [budget, setBudget] = useState<number | null>(() => {
		try {
			const saved = localStorage.getItem("smartcalc-budget");
			return saved ? Number(saved) : null;
		} catch {
			return null;
		}
	});

	const [isEditing, setIsEditing] = useState(false);
	const [inputBudget, setInputBudget] = useState("");

	useEffect(() => {
		try {
			if (budget !== null) {
				localStorage.setItem("smartcalc-budget", String(budget));
			} else {
				localStorage.removeItem("smartcalc-budget");
			}
		} catch (e) {
			console.error(e);
		}
	}, [budget]);

	const handleSave = () => {
		const num = parseCurrencyToNumber(inputBudget);
		if (num > 0) {
			setBudget(num);
			setIsEditing(false);
			toast.success(`Meta de gastos definida para R$ ${formatNumberPtBR(num.toFixed(2))}!`, {
				icon: "🎯",
			});
		}
	};

	const handleRemove = () => {
		setBudget(null);
		setIsEditing(false);
		setInputBudget("");
		toast.info("Meta de gastos removida.");
	};

	const percent = budget && budget > 0 ? Math.min(100, (currentTotal / budget) * 100) : 0;
	const isOverBudget = budget !== null && currentTotal > budget;
	const isNearBudget = budget !== null && currentTotal >= budget * 0.8 && !isOverBudget;
	const remaining = budget !== null ? Math.max(0, budget - currentTotal) : 0;
	const exceeded = budget !== null && isOverBudget ? currentTotal - budget : 0;

	return (
		<div className="mb-2.5 select-none">
			{budget === null && !isEditing ? (
				/* Botão para Definir Meta */
				<button
					type="button"
					onClick={() => {
						setIsEditing(true);
						setInputBudget("");
					}}
					className="w-full py-1.5 px-2.5 rounded-xl bg-white/3 hover:bg-white/6 border border-dashed border-white/10 text-zinc-400 hover:text-cyan-300 text-[11px] font-medium flex items-center justify-between transition-all cursor-pointer"
				>
					<span className="flex items-center gap-1.5">
						<Target size={12} className="text-cyan-400" />
						<span>Definir meta de gastos para a compra</span>
					</span>
					<Plus size={12} />
				</button>
			) : isEditing ? (
				/* Form de edição de meta */
				<div className="p-2 rounded-2xl bg-zinc-900/90 border border-cyan-500/30 tech-modal space-y-1.5">
					<div className="flex items-center justify-between text-[11px] text-zinc-300 font-medium">
						<span className="flex items-center gap-1">
							<Target size={12} className="text-cyan-400" />
							<span>Limite de Gastos (R$)</span>
						</span>
						<button
							type="button"
							onClick={() => setIsEditing(false)}
							className="p-1 text-zinc-400 hover:text-white"
						>
							<X size={12} />
						</button>
					</div>

					<div className="flex items-center gap-1.5">
						<div className="flex items-center gap-1 flex-1 bg-zinc-800 rounded-lg px-2 py-1 border border-white/10">
							<span className="text-xs text-zinc-500">R$</span>
							<input
								type="text"
								inputMode="numeric"
								value={inputBudget}
								onChange={(e) => setInputBudget(formatCurrencyInput(e.target.value))}
								placeholder="0,00"
								autoFocus
								onKeyDown={(e) => {
									if (e.key === "Enter") handleSave();
									if (e.key === "Escape") setIsEditing(false);
								}}
								className="w-full bg-transparent text-xs text-white outline-none tabular-nums"
							/>
						</div>

						<button
							type="button"
							onClick={handleSave}
							className="px-2.5 py-1 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-semibold rounded-lg transition-all active:scale-95 cursor-pointer"
						>
							Salvar
						</button>

						{budget !== null && (
							<button
								type="button"
								onClick={handleRemove}
								title="Remover meta"
								className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
							>
								<Trash2 size={13} />
							</button>
						)}
					</div>
				</div>
			) : (
				/* Card da Barra de Orçamento Ativa */
				<div
					className={`
						p-2.5
						rounded-2xl
						border
						transition-all
						duration-300
						${
							isOverBudget
								? "bg-red-500/10 border-red-500/30"
								: isNearBudget
									? "bg-amber-500/10 border-amber-500/30"
									: "bg-white/3 border-white/8"
						}
					`}
				>
					{/* Top Header do Budget */}
					<div className="flex items-center justify-between text-[11px] mb-1">
						<div className="flex items-center gap-1.5">
							<Target
								size={12}
								className={
									isOverBudget
										? "text-red-400"
										: isNearBudget
											? "text-amber-400"
											: "text-emerald-400"
								}
							/>
							<span className="text-zinc-300 font-medium">Meta de Gastos</span>
						</div>

						<div className="flex items-center gap-1.5">
							<span className="text-zinc-400 font-mono text-[10px]">
								R$ {formatNumberPtBR(currentTotal.toFixed(2))} / R${" "}
								{formatNumberPtBR(String(budget))}
							</span>

							<button
								type="button"
								onClick={() => {
									setInputBudget(budget ? formatInitialPrice(String(budget)) : "");
									setIsEditing(true);
								}}
								title="Editar meta"
								className="p-0.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
							>
								<Edit2 size={11} />
							</button>
						</div>
					</div>

					{/* Barra de Progresso Visual: Tubo de Energia Líquida Neon (Liquid Energy Gauge) */}
					<div className="relative w-full h-2.5 bg-black/70 rounded-full overflow-hidden my-2 border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
						{/* Tubo de vidro com reflexo especular */}
						<div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10 pointer-events-none" />

						{/* Preenchimento Líquido Energético Fluido */}
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${percent}%` }}
							transition={{ type: "spring", stiffness: 180, damping: 20 }}
							className={`
								relative
								h-full
								rounded-full
								transition-colors
								duration-300
								${
									isOverBudget
										? "bg-gradient-to-r from-red-600 via-rose-500 to-red-400 shadow-[0_0_14px_rgba(239,68,68,0.8)]"
										: isNearBudget
											? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.7)]"
											: "bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 shadow-[0_0_14px_rgba(34,211,238,0.7)]"
								}
							`}
						>
							{/* Onda de brilho fluida que corre pelo líquido */}
							<motion.div
								animate={{ x: ["-100%", "200%"] }}
								transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
								className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
							/>
						</motion.div>
					</div>

					{/* Status Subtitle */}
					<div className="flex items-center justify-between text-[10px]">
						{isOverBudget ? (
							<span className="text-red-400 font-bold flex items-center gap-1">
								<AlertCircle size={11} className="animate-pulse" />
								<span>Excedeu R$ {formatNumberPtBR(exceeded.toFixed(2))}</span>
							</span>
						) : (
							<span className="text-emerald-400 font-medium flex items-center gap-1">
								<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
								<span>Restam R$ {formatNumberPtBR(remaining.toFixed(2))}</span>
							</span>
						)}

						<span
							className={`font-mono font-bold ${
								isOverBudget
									? "text-red-400"
									: isNearBudget
										? "text-amber-400"
										: "text-cyan-300"
							}`}
						>
							{((currentTotal / (budget || 1)) * 100).toFixed(0)}%
						</span>
					</div>
				</div>
			)}
		</div>
	);
});
