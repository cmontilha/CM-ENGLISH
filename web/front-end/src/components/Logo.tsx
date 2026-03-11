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
  const logoSizeClasses = {
    sm: "w-9 h-9",
    md: "w-10 h-10",
    lg: "w-12 h-12",
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
      <img
        src="/logo.png"
        alt="CM English logo"
        className={`${logoSizeClasses[size]} object-contain shrink-0`}
      />
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
