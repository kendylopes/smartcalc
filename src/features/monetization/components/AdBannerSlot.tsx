import { ExternalLink, Zap } from "lucide-react";
import React, { memo, useEffect, useRef } from "react";

type AdFormat = "horizontal" | "rectangle" | "auto";

type PartnerAd = {
	title: string;
	desc: string;
	buttonText: string;
	link: string;
	badge?: string;
	icon?: React.ReactNode;
};

type Props = {
	type?: "adsense" | "partner" | "auto";
	adClient?: string;
	adSlot?: string;
	format?: AdFormat;
	partnerData?: PartnerAd;
	className?: string;
};

const DEFAULT_PARTNER_AD: PartnerAd = {
	title: "Economize até 40% nas compras de mercado",
	desc: "Confira cupons diários de desconto e cashback para economizar no supermercado e produtos para sua casa.",
	buttonText: "Ver Ofertas & Cupons",
	link: "https://www.google.com/search?q=cupons+desconto+supermercado",
	badge: "Parceiro",
};

export const AdBannerSlot = memo(function AdBannerSlot({
	type = "auto",
	adClient,
	adSlot,
	format = "horizontal",
	partnerData = DEFAULT_PARTNER_AD,
	className = "",
}: Props) {
	const adRef = useRef<HTMLDivElement>(null);
	const isAdSenseConfigured = Boolean(adClient && adSlot);

	useEffect(() => {
		if (type === "adsense" || (type === "auto" && isAdSenseConfigured)) {
			try {
				// @ts-ignore
				(window.adsbygoogle = window.adsbygoogle || []).push({});
			} catch (e) {
				console.error("AdSense render error:", e);
			}
		}
	}, [type, isAdSenseConfigured]);

	// Se AdSense estiver ativo com ID do cliente e slot
	if ((type === "adsense" || (type === "auto" && isAdSenseConfigured)) && isAdSenseConfigured) {
		return (
			<div
				ref={adRef}
				className={`w-full overflow-hidden rounded-2xl neu-panel p-2 text-center my-4 ${className}`}
			>
				<span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 block mb-1">
					Publicidade
				</span>
				<ins
					className="adsbygoogle"
					style={{ display: "block", minHeight: "90px" }}
					data-ad-client={adClient}
					data-ad-slot={adSlot}
					data-ad-format={format}
					data-full-width-responsive="true"
				/>
			</div>
		);
	}

	// Banner Elegante de Afiliado / Parceiro Comercial
	return (
		<aside
			aria-label="Espaço de publicidade e ofertas parceiras"
			className={`
				relative
				w-full
				overflow-hidden
				rounded-[2rem]
				neu-panel
				p-4 sm:p-5
				border
				border-white/10
				shadow-[0_12px_36px_rgba(0,0,0,0.6)]
				my-6
				group
				transition-all
				duration-300
				hover:border-cyan-500/30
				${className}
			`}
		>
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="flex items-start gap-3 min-w-0">
					<div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
						{partnerData.icon || <Zap size={20} />}
					</div>

					<div className="space-y-1 min-w-0">
						<div className="flex items-center gap-2">
							<span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/6 text-zinc-400 border border-white/10">
								Publicidade
							</span>
							{partnerData.badge && (
								<span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
									{partnerData.badge}
								</span>
							)}
						</div>
						<h4 className="text-sm font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
							{partnerData.title}
						</h4>
						<p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
							{partnerData.desc}
						</p>
					</div>
				</div>

				<a
					href={partnerData.link}
					target="_blank"
					rel="noopener noreferrer sponsored"
					className="
						shrink-0
						w-full sm:w-auto
						flex items-center justify-center gap-2
						px-4 py-2.5
						rounded-xl
						bg-gradient-to-r from-amber-500/20 to-cyan-500/20
						hover:from-amber-500/30 hover:to-cyan-500/30
						border border-white/15 hover:border-cyan-400/40
						text-xs font-semibold text-white
						shadow-sm hover:shadow-cyan-500/10
						transition-all active:scale-95
					"
				>
					<span>{partnerData.buttonText}</span>
					<ExternalLink size={13} className="text-cyan-300" />
				</a>
			</div>
		</aside>
	);
});
