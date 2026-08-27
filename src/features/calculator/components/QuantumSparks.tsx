import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useState } from "react";

type Particle = {
	id: number;
	x: number;
	y: number;
	size: number;
	color: string;
	angle: number;
	speed: number;
};

type Props = {
	triggerKey: number | string;
	color?: string;
};

export const QuantumSparks = memo(function QuantumSparks({ triggerKey, color = "#22d3ee" }: Props) {
	const [particles, setParticles] = useState<Particle[]>([]);
	const [showBeam, setShowBeam] = useState(false);

	useEffect(() => {
		if (!triggerKey) return;

		// Gera 14 micro-partículas quânticas
		const colors = [color, "#ffffff", "#38bdf8", "#818cf8", "#f472b6"];
		const newParticles: Particle[] = Array.from({ length: 14 }).map((_, i) => ({
			id: Math.random() + i,
			x: 50 + (Math.random() * 20 - 10), // Centralizado no visor (50%)
			y: 65,
			size: Math.random() * 4 + 2,
			color: colors[Math.floor(Math.random() * colors.length)],
			angle: Math.random() * Math.PI * 2,
			speed: Math.random() * 45 + 20,
		}));

		setParticles(newParticles);
		setShowBeam(true);

		const timer = setTimeout(() => {
			setParticles([]);
			setShowBeam(false);
		}, 800);

		return () => clearTimeout(timer);
	}, [triggerKey, color]);

	return (
		<div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.8rem] z-20">
			{/* Onda de Choque de Luz / Feixe Laser Horizontal */}
			<AnimatePresence>
				{showBeam && (
					<motion.div
						initial={{ opacity: 0.8, scaleX: 0.1, scaleY: 2 }}
						animate={{ opacity: [0.9, 0.4, 0], scaleX: [0.1, 1.2, 1.4], scaleY: [2, 0.5, 0] }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_20px_#ffffff,0_0_35px_var(--theme-color,#22d3ee)] blur-[0.5px]"
					/>
				)}
			</AnimatePresence>

			{/* Micro-Partículas Flutuantes */}
			{particles.map((p) => {
				const destX = Math.cos(p.angle) * p.speed;
				const destY = Math.sin(p.angle) * p.speed - 30; // Tendência a subir

				return (
					<motion.span
						key={p.id}
						initial={{ opacity: 1, scale: 1, x: `${p.x}%`, y: `${p.y}%` }}
						animate={{
							opacity: 0,
							scale: 0,
							x: `calc(${p.x}% + ${destX}px)`,
							y: `calc(${p.y}% + ${destY}px)`,
						}}
						transition={{ duration: 0.75, ease: "easeOut" }}
						style={{
							position: "absolute",
							width: p.size,
							height: p.size,
							backgroundColor: p.color,
							borderRadius: "9999px",
							boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
						}}
					/>
				);
			})}
		</div>
	);
});
