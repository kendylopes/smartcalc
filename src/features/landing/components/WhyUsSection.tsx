import { memo } from "react";
import {
	HeartHandshake,
	Lock,
	ShieldCheck,
	Smartphone,
	WifiOff,
} from "lucide-react";
import type { ThemeConfig } from "@/features/calculator/hooks/useThemes";

type Props = {
	theme?: ThemeConfig;
};

export const WhyUsSection = memo(function WhyUsSection({}: Props) {
	const perks = [
		{
			title: "100% Privado & Seguro",
			description:
				"Não exigimos login, cadastro nem senha. Seus históricos e orçamentos ficam gravados exclusivamente no seu próprio navegador.",
			icon: <Lock size={20} className="text-cyan-400" />,
		},
		{
			title: "Funciona Sem Internet (Offline)",
			description:
				"Com tecnologia PWA (Progressive Web App), o SmartCalc abre instantaneamente mesmo em áreas sem sinal de internet ou 4G.",
			icon: <WifiOff size={20} className="text-purple-400" />,
		},
		{
			title: "Vibração Tátil & Soft-UI 3D",
			description:
				"O visual Dark Neumorphism e o feedback tátil háptico reproduzem a sensação física de pressionar uma calculadora real.",
			icon: <Smartphone size={20} className="text-amber-400" />,
		},
		{
			title: "100% Gratuito & Livre",
			description:
				"Todas as funções avançadas (Científica, Comparador, Câmbio e Finanças) estão liberadas gratuitamente para todos.",
			icon: <HeartHandshake size={20} className="text-emerald-400" />,
		},
	];

	return (
		<section id="diferenciais" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
			<div className="rounded-[2.6rem] neu-chassis p-6 sm:p-10 md:p-14 relative overflow-hidden">
				{/* Brilho decorativo de fundo */}
				<div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

				<div className="relative z-10 space-y-10">
					<div className="max-w-2xl space-y-3">
						<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
							<ShieldCheck size={13} />
							<span>Diferenciais SmartCalc</span>
						</div>
						<h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
							Por que milhares de pessoas escolhem o SmartCalc?
						</h2>
						<p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
							Uma plataforma desenhada com foco em agilidade, privacidade e utilidade para o dia a dia.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{perks.map((p) => (
							<div
								key={p.title}
								className="p-5 rounded-2xl bg-white/4 border border-white/6 hover:border-white/12 transition-all space-y-3"
							>
								<div className="p-2.5 rounded-xl bg-white/5 w-fit border border-white/8">
									{p.icon}
								</div>
								<h3 className="text-sm font-bold text-zinc-100">{p.title}</h3>
								<p className="text-xs text-zinc-400 leading-relaxed">{p.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
});
