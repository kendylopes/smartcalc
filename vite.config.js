import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.svg", "logo.png", "manifest.json"],
			manifest: {
				name: "SmartCalc — Calculadora de Supermercado & Finanças",
				short_name: "SmartCalc",
				description:
					"Calculadora inteligente para compras de mercado, comparador de embalagens, simulador de finanças e divisor de contas.",
				start_url: "/",
				display: "standalone",
				background_color: "#0b0d13",
				theme_color: "#22d3ee",
				orientation: "portrait",
				lang: "pt-BR",
				icons: [
					{
						src: "/logo.png",
						sizes: "192x192 512x512",
						type: "image/png",
						purpose: "any maskable",
					},
					{
						src: "/favicon.svg",
						sizes: "any",
						type: "image/svg+xml",
						purpose: "any",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,svg,png,ico,json,woff,woff2}"],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "google-fonts-cache",
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365,
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
					{
						urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "gstatic-fonts-cache",
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365,
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
						return "vendor-react";
					}
					if (id.includes("node_modules/framer-motion/")) {
						return "vendor-motion";
					}
					if (id.includes("node_modules/lucide-react/")) {
						return "vendor-icons";
					}
				},
			},
		},
	},
});
