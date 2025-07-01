import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showIcon?: boolean;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
}

const Logo: React.FC<LogoProps> = ({
  size = "md",
  showIcon = true,
  className = "",
  textClassName = "",
  iconClassName = "",
}) => {
  const sizeClasses = {
    sm: "text-lg md:text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-5xl md:text-6xl",
  };

  const iconSizes = {
    sm: "w-2 h-2 md:w-3 md:h-3",
    md: "w-3 h-3 md:w-4 md:h-4",
    lg: "w-4 h-4 md:w-5 md:h-5",
    xl: "w-5 h-5 md:w-6 md:h-6",
  };

  const iconPositions = {
    sm: "-top-0.5 md:-top-1 -left-0.5 md:-left-1",
    md: "-top-1 md:-top-2 -left-0.5 md:-left-1",
    lg: "-top-1 md:-top-2 -left-1 md:-left-2",
    xl: "-top-2 md:-top-3 -left-1 md:-left-2",
  };

  return (
    <div
      className={`relative font-bold text-white tracking-wide bg-opacity-20  px-4 py-2  ${sizeClasses[size]} ${className} mb-10`}
    >
      <span className={textClassName}>SnapStyler</span>
    </div>
  );
};

export default Logo;
