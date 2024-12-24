'use client'
import type React from "react";
import { motion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
interface AnimatedButtonProps extends ButtonProps {
	children: React.ReactNode;
	shrink?: number;
	animate?: boolean;
}
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
	children,
	asChild,
	type = "button",
	size = undefined,
	className = undefined,
	shrink = 0.95,
	animate = false,
	...props
}) => {
	return (
		<div className="inline-block">
			<motion.div
				whileTap={{ scale: shrink }}
				style={{ transformOrigin: "center" }}
				layout={animate}
				transition={{
					layout: {
						duration: 0.2,
						ease: "easeInOut"
					}
				}}
			>
				<Button
						asChild={asChild}
						type={type}
						size={size}
						className={`${animate ? 'transition-all duration-200' : ''} ${className}`}
						{...props}
				>
					{children}
				</Button>
			</motion.div>
		</div>
	);
};