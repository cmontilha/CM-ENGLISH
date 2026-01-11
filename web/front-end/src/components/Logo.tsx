import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const Logo = ({ size = "md", animated = true }: LogoProps) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const Wrapper = animated ? motion.div : "div";

  return (
    <Wrapper
      className="flex items-center gap-2"
      {...(animated && {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.5 },
      })}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
          <span className="text-white font-display font-bold text-lg">CM</span>
        </div>
        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl opacity-50 blur-sm -z-10" />
      </div>
      <div className="flex flex-col">
        <span className={`font-display font-bold gradient-text ${sizeClasses[size]}`}>
          CM ENGLISH
        </span>
        {size !== "sm" && (
          <span className="text-xs text-muted-foreground tracking-wider">
            English for Real Life
          </span>
        )}
      </div>
    </Wrapper>
  );
};

export default Logo;
