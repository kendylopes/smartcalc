import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useState } from "react";

export function use3dCardTilt(maxRotation = 8) {
	const [isHovered, setIsHovered] = useState(false);

	// Motion values normalizados de -0.5 a 0.5
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	// Física de mola ultra-suave
	const springConfig = { damping: 25, stiffness: 220, mass: 0.6 };
	const smoothMouseX = useSpring(mouseX, springConfig);
	const smoothMouseY = useSpring(mouseY, springConfig);

	// Rotação 3D
	const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [maxRotation, -maxRotation]);
	const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-maxRotation, maxRotation]);

	// Posição da luz de reflexo holográfico (0% a 100%)
	const glareX = useTransform(smoothMouseX, [-0.5, 0.5], [0, 100]);
	const glareY = useTransform(smoothMouseY, [-0.5, 0.5], [0, 100]);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			const rect = e.currentTarget.getBoundingClientRect();
			if (!rect.width || !rect.height) return;

			// Coordenadas relativas de -0.5 (esquerda/topo) a +0.5 (direita/baixo)
			const x = (e.clientX - rect.left) / rect.width - 0.5;
			const y = (e.clientY - rect.top) / rect.height - 0.5;

			mouseX.set(x);
			mouseY.set(y);
		},
		[mouseX, mouseY],
	);

	const handleMouseEnter = useCallback(() => {
		setIsHovered(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setIsHovered(false);
		mouseX.set(0);
		mouseY.set(0);
	}, [mouseX, mouseY]);

	return {
		rotateX,
		rotateY,
		glareX,
		glareY,
		isHovered,
		handleMouseMove,
		handleMouseEnter,
		handleMouseLeave,
	};
}
