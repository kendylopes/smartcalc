import { AnimatePresence, motion } from "framer-motion";
import {
	Camera,
	Check,
	Flashlight,
	FlashlightOff,
	Minus,
	Plus,
	ScanBarcode,
	ShoppingBag,
	SwitchCamera,
	X,
} from "lucide-react";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ThemeConfig } from "@/features/calculator/hooks/useThemes";
import { useI18n } from "@/features/i18n";

// Base de dados local com códigos EAN comuns do mercado brasileiro para identificação instantânea offline
const COMMON_EAN_DATABASE: Record<string, { name: string; defaultPrice: string; category: string }> = {
	"7891000100103": { name: "🥛 Leite Condensado Moça 395g", defaultPrice: "6.99", category: "Laticínios" },
	"7891000053508": { name: "☕ Café Nescafé Tradicional 100g", defaultPrice: "14.90", category: "Mercearia" },
	"7891055300053": { name: "🍚 Arroz Branco Tipo 1 (5kg)", defaultPrice: "28.90", category: "Grãos" },
	"7891055300060": { name: "🫘 Feijão Carioca Tipo 1 (1kg)", defaultPrice: "8.49", category: "Grãos" },
	"7894900011517": { name: "🥤 Coca-Cola Original 2 Litros", defaultPrice: "9.99", category: "Bebidas" },
	"7891150000000": { name: "🥛 Leite Integral Longa Vida 1L", defaultPrice: "4.89", category: "Laticínios" },
	"7891025111111": { name: "🧼 Detergente Líquido 500ml", defaultPrice: "2.49", category: "Limpeza" },
	"7898000000000": { name: "🍞 Pão de Forma Tradicional 500g", defaultPrice: "7.90", category: "Padaria" },
	"7891000245678": { name: "🍝 Macarrão Espaguete 500g", defaultPrice: "4.20", category: "Massas" },
	"7891000333333": { name: "🥫 Molho de Tomate Tradicional 340g", defaultPrice: "2.89", category: "Mercearia" },
	"7891000444444": { name: "🧻 Papel Higiênico 12 Rolos", defaultPrice: "18.90", category: "Higiene" },
	"7891000555555": { name: "🥩 Contra Filé Bovino (kg)", defaultPrice: "42.90", category: "Açougue" },
	"7891000666666": { name: "🧀 Queijo Mussarela Fatiado 200g", defaultPrice: "9.50", category: "Frios" },
	"7891000777777": { name: "🥚 Ovos Brancos Grandes (12 un)", defaultPrice: "11.90", category: "Ovos" },
};

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onAddProduct: (unitPrice: string, qty: number, productName: string) => void;
	theme: ThemeConfig;
	onPlayBeep?: () => void;
	onPlayClick?: () => void;
};

export const BarcodeScannerModal = memo(function BarcodeScannerModal({
	isOpen,
	onClose,
	onAddProduct,
	theme,
	onPlayBeep,
	onPlayClick,
}: Props) {
	const { formatMoney } = useI18n();
	const videoRef = useRef<HTMLVideoElement>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
	const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
	const [isTorchOn, setIsTorchOn] = useState(false);
	const [hasTorchSupport, setHasTorchSupport] = useState(false);

	// Estado do produto detectado
	const [detectedBarcode, setDetectedBarcode] = useState<string | null>(null);
	const [productName, setProductName] = useState("");
	const [unitPrice, setUnitPrice] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [isManualInput, setIsManualInput] = useState(false);
	const [manualBarcodeInput, setManualBarcodeInput] = useState("");

	const isScanningRef = useRef(false);

	// Iniciar a câmera ao abrir o modal
	const startCamera = useCallback(async () => {
		if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
			setHasCameraPermission(false);
			return;
		}

		try {
			// Para stream anterior se houver
			if (stream) {
				for (const track of stream.getTracks()) {
					track.stop();
				}
			}

			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: { ideal: facingMode },
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
				audio: false,
			});

			setStream(mediaStream);
			setHasCameraPermission(true);

			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream;
				await videoRef.current.play();
			}

			// Verifica suporte a Lanterna / Torch
			const track = mediaStream.getVideoTracks()[0];
			// @ts-ignore
			const capabilities = track.getCapabilities?.();
			// @ts-ignore
			if (capabilities?.torch) {
				setHasTorchSupport(true);
			} else {
				setHasTorchSupport(false);
			}
		} catch (err) {
			console.error("Camera access error:", err);
			setHasCameraPermission(false);
		}
	}, [facingMode, stream]);

	// Parar câmera
	const stopCamera = useCallback(() => {
		if (stream) {
			for (const track of stream.getTracks()) {
				track.stop();
			}
			setStream(null);
		}
		setIsTorchOn(false);
	}, [stream]);

	// Alternar Lanterna
	const toggleTorch = useCallback(async () => {
		if (!stream) return;
		const track = stream.getVideoTracks()[0];
		try {
			const nextState = !isTorchOn;
			// @ts-ignore
			await track.applyConstraints({ advanced: [{ torch: nextState }] });
			setIsTorchOn(nextState);
			onPlayClick?.();
		} catch (e) {
			console.error("Torch error:", e);
		}
	}, [stream, isTorchOn, onPlayClick]);

	// Alternar Câmera Frontal / Traseira
	const toggleCamera = () => {
		setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
		onPlayClick?.();
	};

	// Tratar código detectado
	const handleBarcodeDetected = useCallback(
		(barcodeRaw: string) => {
			if (isScanningRef.current) return;
			isScanningRef.current = true;

			const cleanBarcode = barcodeRaw.trim();
			setDetectedBarcode(cleanBarcode);
			onPlayBeep?.();

			// Verifica na base de dados
			const found = COMMON_EAN_DATABASE[cleanBarcode];
			if (found) {
				setProductName(found.name);
				setUnitPrice(found.defaultPrice);
				toast.success("Produto reconhecido!", {
					description: `${found.name} • ${cleanBarcode}`,
					icon: "🛒",
				});
			} else {
				setProductName(`Item Código ${cleanBarcode.slice(-4)}`);
				setUnitPrice("");
				toast.info("Código de barras lido!", {
					description: `EAN: ${cleanBarcode}. Digite o valor da etiqueta.`,
					icon: "📷",
				});
			}
		},
		[onPlayBeep],
	);

	// Loop de Leitura de Código de Barras (BarcodeDetector nativo)
	useEffect(() => {
		if (!isOpen || !stream || detectedBarcode) return;

		let animationFrameId: number;
		// @ts-ignore
		const BarcodeDetectorClass = window.BarcodeDetector;

		if (BarcodeDetectorClass) {
			const barcodeDetector = new BarcodeDetectorClass({
				formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "qr_code"],
			});

			const scanLoop = async () => {
				if (videoRef.current && videoRef.current.readyState === 4 && !isScanningRef.current) {
					try {
						const barcodes = await barcodeDetector.detect(videoRef.current);
						if (barcodes.length > 0) {
							const code = barcodes[0].rawValue;
							if (code) {
								handleBarcodeDetected(code);
								return;
							}
						}
					} catch {
						// Frame detect pass
					}
				}
				animationFrameId = requestAnimationFrame(scanLoop);
			};

			animationFrameId = requestAnimationFrame(scanLoop);
		}

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, [isOpen, stream, detectedBarcode, handleBarcodeDetected]);

	// Inicialização e limpeza ao abrir/fechar
	useEffect(() => {
		if (isOpen) {
			isScanningRef.current = false;
			setDetectedBarcode(null);
			setProductName("");
			setUnitPrice("");
			setQuantity(1);
			startCamera();
		} else {
			stopCamera();
		}
		return () => {
			stopCamera();
		};
	}, [isOpen, startCamera, stopCamera]);

	// Resetar para ler próximo produto sem fechar o modal (Modo Contínuo de Supermercado)
	const handleScanNext = () => {
		isScanningRef.current = false;
		setDetectedBarcode(null);
		setProductName("");
		setUnitPrice("");
		setQuantity(1);
		setManualBarcodeInput("");
		onPlayClick?.();
	};

	// Adicionar produto no carrinho e na calculadora
	const handleConfirmProduct = () => {
		const cleanPrice = unitPrice.replace(",", ".").trim();
		const numPrice = Number(cleanPrice);

		if (!cleanPrice || isNaN(numPrice) || numPrice <= 0) {
			toast.error("Insira um preço válido para o produto.");
			return;
		}

		const finalName = productName.trim() || `Produto ${detectedBarcode || ""}`;
		onAddProduct(cleanPrice, quantity, finalName);
		onPlayBeep?.();

		toast.success("Adicionado à Calculadora!", {
			description: `${quantity}x ${finalName} — Total: ${formatMoney(numPrice * quantity)}`,
			icon: "✅",
		});

		// Reseta para ler o próximo item
		handleScanNext();
	};

	// Simular leitura com código manual
	const handleManualBarcodeSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!manualBarcodeInput.trim()) return;
		handleBarcodeDetected(manualBarcodeInput.trim());
		setIsManualInput(false);
	};

	// Atalhos rápidos de teste em 1-clique caso esteja sem câmera ou no desktop
	const handleQuickSampleBarcode = (ean: string) => {
		handleBarcodeDetected(ean);
	};

	const totalItemValue = (Number(unitPrice.replace(",", ".")) || 0) * quantity;

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
						className="absolute inset-0 bg-black/90 backdrop-blur-md"
					/>

					{/* Card do Modal */}
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
							rounded-[2.4rem]
							border
							border-white/12
							tech-modal
							p-4 sm:p-5
							shadow-[0_24px_70px_rgba(0,0,0,0.9)]
							flex
							flex-col
							space-y-4
						"
					>
						{/* Header */}
						<div className="flex items-center justify-between pb-3 border-b border-white/8 shrink-0">
							<div className="flex items-center gap-2.5">
								<div
									className={`
										p-2
										rounded-2xl
										${theme.operatorBgActive || "bg-cyan-500/10"}
										border
										${theme.operatorBorderActive || "border-cyan-500/20"}
										${theme.accentText || "text-cyan-400"}
									`}
								>
									<ScanBarcode size={20} />
								</div>
								<div>
									<h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
										<span>Leitor de Código de Barras</span>
										<span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
											CAMERA
										</span>
									</h2>
									<p className="text-[11px] text-zinc-400">
										Aponte a câmera para a embalagem no mercado
									</p>
								</div>
							</div>

							<button
								type="button"
								onClick={onClose}
								aria-label="Fechar scanner"
								className="p-1.5 rounded-2xl bg-white/4 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/6 active:scale-95 transition-all outline-none cursor-pointer"
							>
								<X size={18} />
							</button>
						</div>

						{/* VISOR DA CÂMERA & MIRA LASER */}
						{!detectedBarcode ? (
							<div className="space-y-3">
								<div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 flex items-center justify-center">
									{hasCameraPermission === false ? (
										<div className="text-center p-6 space-y-2 text-zinc-400">
											<Camera size={36} className="mx-auto text-zinc-600 mb-1" />
											<p className="text-xs font-semibold text-zinc-300">
												Câmera não disponível ou permissão negada
											</p>
											<p className="text-[11px] text-zinc-500">
												Permita o acesso à câmera nas configurações do navegador ou use o botão de simulação abaixo.
											</p>
										</div>
									) : (
										<>
											<video
												ref={videoRef}
												playsInline
												muted
												autoPlay
												className="w-full h-full object-cover"
											/>

											{/* Mira de Escaneamento Holográfica */}
											<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
												<div className="relative w-64 h-36 border-2 border-dashed border-cyan-400/70 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center">
													{/* Linha Laser Animada */}
													<motion.div
														animate={{ y: [-60, 60, -60] }}
														transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
														className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]"
													/>
												</div>
											</div>

											{/* Controles sobrepostos na Câmera */}
											<div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
												{hasTorchSupport && (
													<button
														type="button"
														onClick={toggleTorch}
														className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
															isTorchOn
																? "bg-amber-500/30 text-amber-300 border-amber-500/50 shadow-md"
																: "bg-black/60 text-zinc-300 border-white/15 hover:bg-black/80"
														}`}
														title="Ligar/Desligar Lanterna"
													>
														{isTorchOn ? <Flashlight size={16} /> : <FlashlightOff size={16} />}
													</button>
												)}

												<button
													type="button"
													onClick={toggleCamera}
													className="p-2 rounded-xl bg-black/60 border border-white/15 text-zinc-300 hover:text-white backdrop-blur-md transition-all cursor-pointer ml-auto"
													title="Alternar Câmera Frontal / Traseira"
												>
													<SwitchCamera size={16} />
												</button>
											</div>
										</>
									)}
								</div>

								{/* Atalhos Rápidos de Simulação & Digitação Manual */}
								<div className="space-y-2">
									<div className="flex items-center justify-between text-[11px] text-zinc-400">
										<span>Ou teste com produtos comuns:</span>
										<button
											type="button"
											onClick={() => setIsManualInput(!isManualInput)}
											className="text-cyan-400 hover:underline cursor-pointer"
										>
											{isManualInput ? "Fechar código manual" : "Digitar código EAN"}
										</button>
									</div>

									{/* Form de código manual */}
									{isManualInput ? (
										<form onSubmit={handleManualBarcodeSubmit} className="flex gap-2">
											<input
												type="text"
												placeholder="Digite o código EAN-13 (ex: 7891000100103)"
												value={manualBarcodeInput}
												onChange={(e) => setManualBarcodeInput(e.target.value)}
												className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400 font-mono"
											/>
											<button
												type="submit"
												className="px-3 py-2 rounded-xl bg-cyan-500 text-zinc-950 font-semibold text-xs cursor-pointer hover:bg-cyan-400 transition-colors"
											>
												Ler
											</button>
										</form>
									) : (
										<div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar p-1 bg-zinc-950/40 rounded-xl border border-white/6">
											{Object.entries(COMMON_EAN_DATABASE).slice(0, 6).map(([ean, item]) => (
												<button
													key={ean}
													type="button"
													onClick={() => handleQuickSampleBarcode(ean)}
													className="px-2.5 py-1 rounded-lg bg-white/4 hover:bg-white/10 border border-white/8 text-[10px] text-zinc-300 hover:text-white transition-all cursor-pointer truncate max-w-40"
													title={item.name}
												>
													{item.name}
												</button>
											))}
										</div>
									)}
								</div>
							</div>
						) : (
							/* PRODUTO DETECTADO — FORMULÁRIO DE CONFIRMAÇÃO */
							<div className="space-y-3.5">
								<div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Check size={18} className="text-cyan-400" />
										<div>
											<p className="text-[10px] uppercase font-mono text-cyan-400 font-semibold">
												Código Detectado
											</p>
											<p className="text-xs font-mono text-white font-bold">{detectedBarcode}</p>
										</div>
									</div>

									<button
										type="button"
										onClick={handleScanNext}
										className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-zinc-200 hover:text-white border border-white/15 transition-all cursor-pointer"
									>
										Escanear Outro
									</button>
								</div>

								{/* Nome do Produto */}
								<div className="space-y-1">
									<label className="text-[11px] font-semibold text-zinc-300">Nome do Produto</label>
									<input
										type="text"
										value={productName}
										onChange={(e) => setProductName(e.target.value)}
										placeholder="Nome ou descrição do item"
										className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400"
									/>
								</div>

								{/* Preço Unitário & Quantidade */}
								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-1">
										<label className="text-[11px] font-semibold text-zinc-300">
											Preço Unitário (R$)
										</label>
										<input
											type="text"
											inputMode="decimal"
											value={unitPrice}
											onChange={(e) => setUnitPrice(e.target.value)}
											placeholder="0,00"
											autoFocus
											className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-sm font-mono font-bold text-white placeholder-zinc-500 outline-none focus:border-cyan-400"
										/>
									</div>

									{/* Contador de Quantidade */}
									<div className="space-y-1">
										<label className="text-[11px] font-semibold text-zinc-300">Quantidade</label>
										<div className="flex items-center justify-between p-1 rounded-xl bg-zinc-900 border border-white/15">
											<button
												type="button"
												onClick={() => setQuantity((q) => Math.max(1, q - 1))}
												className="p-1.5 rounded-lg bg-white/6 hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer"
											>
												<Minus size={14} />
											</button>
											<span className="text-sm font-bold font-mono text-white">{quantity}</span>
											<button
												type="button"
												onClick={() => setQuantity((q) => q + 1)}
												className="p-1.5 rounded-lg bg-white/6 hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer"
											>
												<Plus size={14} />
											</button>
										</div>
									</div>
								</div>

								{/* Resumo do Item */}
								{unitPrice && (
									<div className="p-3 rounded-2xl bg-zinc-950 border border-white/8 flex items-center justify-between text-xs">
										<span className="text-zinc-400">Total do Item:</span>
										<span className="font-bold text-emerald-400 font-mono text-sm">
											{formatMoney(totalItemValue)}
										</span>
									</div>
								)}

								{/* Botão de Adicionar ao Carrinho */}
								<button
									type="button"
									onClick={handleConfirmProduct}
									className="
										w-full
										py-3.5
										rounded-2xl
										bg-gradient-to-r from-emerald-500 to-cyan-500
										hover:from-emerald-400 hover:to-cyan-400
										text-zinc-950
										font-bold
										text-sm
										shadow-[0_4px_20px_rgba(16,185,129,0.3)]
										transition-all
										active:scale-95
										cursor-pointer
										flex
										items-center
										justify-center
										gap-2
									"
								>
									<ShoppingBag size={18} />
									<span>
										Adicionar ao Carrinho ({formatMoney(totalItemValue)})
									</span>
								</button>
							</div>
						)}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
});
