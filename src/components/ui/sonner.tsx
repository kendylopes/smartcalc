import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme="dark"
			position="top-center"
			className="toaster group"
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-[#0f131c] group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-[0_16px_40px_rgba(0,0,0,0.85)] group-[.toaster]:rounded-2xl group-[.toaster]:p-3.5 font-sans",
					description: "group-[.toast]:text-zinc-400 text-xs",
					actionButton:
						"group-[.toast]:bg-cyan-500 group-[.toast]:text-black group-[.toast]:rounded-xl font-semibold",
					cancelButton:
						"group-[.toast]:bg-white/10 group-[.toast]:text-zinc-300 group-[.toast]:rounded-xl",
				},
			}}
			{...props}
		/>
	);
};

export { toast };
