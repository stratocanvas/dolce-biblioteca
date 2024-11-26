import type React from "react";
import { motion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
interface AnimatedButtonProps extends ButtonProps {
	children: React.ReactNode;
	shrink?: number;
}
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
	children,
	asChild,
	type = "button",
	size = undefined,
	className = undefined,
	shrink: shrink = 0.95,
	...props
}) => {
	return (
		<div className="inline-block">
			<motion.div
				whileTap={{ scale: shrink }}
				style={{ transformOrigin: "center" }}
			>
				<Button
					asChild={asChild}
					type={type}
					size={size}
					className={`${className}`}
					{...props}
				>
					{children}
				</Button>
			</motion.div>
		</div>
	);
};