import type React from "react";
import { motion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
interface AnimatedButtonProps extends ButtonProps {
	children: React.ReactNode;
	scale?: number;
}
const AnimatedButton: React.FC<AnimatedButtonProps> = ({
	children,
	asChild,
	type = "button",
	size = undefined,
	className = undefined,
	scale = 0.95,
	...props
}) => {
	return (
		<div className="inline-block">
			<motion.div
				whileTap={{ scale: scale }}
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
export default AnimatedButton;