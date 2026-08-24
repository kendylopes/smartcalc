import { useEffect, useState } from "react";

export type ThemeId = "cyan" | "violet" | "emerald" | "rose" | "amber";
export type ColorMode = "dark" | "light";

export type ThemeConfig = {
	id: ThemeId;
	name: string;
	hex: string;
	glowColor: string;
	dotColor: string;
	accentText: string;
	accentBorder: string;
	operatorText: string;
	operatorBgActive: string;
	operatorBorderActive: string;
	equalBg: string;
	ring: string;
	cursorColor: string;
	cssVars: Record<string, string>;
};

export const THEMES: Record<ThemeId, ThemeConfig> = {
	cyan: {
		id: "cyan",
		name: "Cyber Cyan",
		hex: "#22d3ee",
		glowColor: "rgba(34, 211, 238, 0.25)",
		dotColor: "bg-cyan-400",
		accentText: "text-cyan-400",
		accentBorder: "border-cyan-400/40",
		operatorText: "text-cyan-400",
		operatorBgActive: "bg-cyan-950/60",
		operatorBorderActive: "border-cyan-400/60",
		equalBg: "bg-cyan-400 text-black font-semibold shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:bg-cyan-300",
		ring: "focus-visible:ring-cyan-400",
		cursorColor: "text-cyan-400",
		cssVars: {
			"--theme-color": "#22d3ee",
			"--theme-glow": "rgba(34, 211, 238, 0.25)",
			"--theme-accent": "#38bdf8",
			"--theme-border": "rgba(34, 211, 238, 0.35)",
			"--theme-bg-subtle": "rgba(34, 211, 238, 0.08)",
		},
	},
	violet: {
		id: "violet",
		name: "Electric Violet",
		hex: "#c084fc",
		glowColor: "rgba(192, 132, 252, 0.25)",
		dotColor: "bg-purple-400",
		accentText: "text-purple-400",
		accentBorder: "border-purple-400/40",
		operatorText: "text-purple-400",
		operatorBgActive: "bg-purple-950/60",
		operatorBorderActive: "border-purple-400/60",
		equalBg: "bg-purple-500 text-white font-semibold shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:bg-purple-400",
		ring: "focus-visible:ring-purple-400",
		cursorColor: "text-purple-400",
		cssVars: {
			"--theme-color": "#c084fc",
			"--theme-glow": "rgba(192, 132, 252, 0.25)",
			"--theme-accent": "#d8b4fe",
			"--theme-border": "rgba(192, 132, 252, 0.35)",
			"--theme-bg-subtle": "rgba(192, 132, 252, 0.08)",
		},
	},
	emerald: {
		id: "emerald",
		name: "Emerald Matrix",
		hex: "#34d399",
		glowColor: "rgba(52, 211, 153, 0.25)",
		dotColor: "bg-emerald-400",
		accentText: "text-emerald-400",
		accentBorder: "border-emerald-400/40",
		operatorText: "text-emerald-400",
		operatorBgActive: "bg-emerald-950/60",
		operatorBorderActive: "border-emerald-400/60",
		equalBg: "bg-emerald-400 text-black font-semibold shadow-[0_0_20px_rgba(52,211,153,0.35)] hover:bg-emerald-300",
		ring: "focus-visible:ring-emerald-400",
		cursorColor: "text-emerald-400",
		cssVars: {
			"--theme-color": "#34d399",
			"--theme-glow": "rgba(52, 211, 153, 0.25)",
			"--theme-accent": "#6ee7b7",
			"--theme-border": "rgba(52, 211, 153, 0.35)",
			"--theme-bg-subtle": "rgba(52, 211, 153, 0.08)",
		},
	},
	rose: {
		id: "rose",
		name: "Sunset Rose",
		hex: "#fb7185",
		glowColor: "rgba(251, 113, 133, 0.25)",
		dotColor: "bg-rose-400",
		accentText: "text-rose-400",
		accentBorder: "border-rose-400/40",
		operatorText: "text-rose-400",
		operatorBgActive: "bg-rose-950/60",
		operatorBorderActive: "border-rose-400/60",
		equalBg: "bg-rose-500 text-white font-semibold shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:bg-rose-400",
		ring: "focus-visible:ring-rose-400",
		cursorColor: "text-rose-400",
		cssVars: {
			"--theme-color": "#fb7185",
			"--theme-glow": "rgba(251, 113, 133, 0.25)",
			"--theme-accent": "#fda4af",
			"--theme-border": "rgba(251, 113, 133, 0.35)",
			"--theme-bg-subtle": "rgba(251, 113, 133, 0.08)",
		},
	},
	amber: {
		id: "amber",
		name: "Solar Amber",
		hex: "#fbbf24",
		glowColor: "rgba(251, 191, 36, 0.25)",
		dotColor: "bg-amber-400",
		accentText: "text-amber-400",
		accentBorder: "border-amber-400/40",
		operatorText: "text-amber-400",
		operatorBgActive: "bg-amber-950/60",
		operatorBorderActive: "border-amber-400/60",
		equalBg: "bg-amber-400 text-black font-semibold shadow-[0_0_20px_rgba(251,191,36,0.35)] hover:bg-amber-300",
		ring: "focus-visible:ring-amber-400",
		cursorColor: "text-amber-400",
		cssVars: {
			"--theme-color": "#fbbf24",
			"--theme-glow": "rgba(251, 191, 36, 0.25)",
			"--theme-accent": "#fde68a",
			"--theme-border": "rgba(251, 191, 36, 0.35)",
			"--theme-bg-subtle": "rgba(251, 191, 36, 0.08)",
		},
	},
};

export function useThemes() {
	const [themeId, setThemeId] = useState<ThemeId>(() => {
		try {
			const saved = localStorage.getItem("calculator-theme") as ThemeId;
			return saved && THEMES[saved] ? saved : "cyan";
		} catch {
			return "cyan";
		}
	});

	const [colorMode, setColorMode] = useState<ColorMode>(() => {
		try {
			const savedMode = localStorage.getItem("calculator-color-mode") as ColorMode;
			return savedMode === "light" ? "light" : "dark";
		} catch {
			return "dark";
		}
	});

	const theme = THEMES[themeId] || THEMES.cyan;

	const setTheme = (id: ThemeId) => {
		if (THEMES[id]) {
			setThemeId(id);
			try {
				localStorage.setItem("calculator-theme", id);
			} catch (e) {
				console.error(e);
			}
		}
	};

	const toggleColorMode = () => {
		setColorMode((prev) => {
			const next = prev === "dark" ? "light" : "dark";
			try {
				localStorage.setItem("calculator-color-mode", next);
			} catch (e) {
				console.error(e);
			}
			return next;
		});
	};

	// Atualiza as classes HTML e variáveis CSS dinamicamente
	useEffect(() => {
		const root = document.documentElement;
		if (colorMode === "light") {
			root.classList.remove("dark");
			root.classList.add("light");
		} else {
			root.classList.remove("light");
			root.classList.add("dark");
		}

		for (const [key, value] of Object.entries(theme.cssVars)) {
			root.style.setProperty(key, value);
		}
	}, [theme, colorMode]);

	return {
		theme,
		themeId,
		setTheme,
		colorMode,
		toggleColorMode,
		allThemes: Object.values(THEMES),
	};
}
