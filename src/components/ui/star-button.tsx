import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  starColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  children = "Order Now",
  className = "",
  starColor,
  onClick,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        group relative inline-flex items-center justify-center
        text-white 
        bg-[#4A2818] 
        border border-white/25 
        rounded-full 
        shadow-md 
        transition-all duration-300 ease-in-out 
        cursor-pointer
        hover:bg-[#2E1509] hover:shadow-[0_0_20px_rgba(74,40,24,0.6)] hover:border-white/40
        active:scale-95
        ${className || "px-4 py-1.5 text-xs sm:text-sm"}
      `}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center space-x-1.5">
        {children}
      </span>

      {/* Star 1 */}
      <div
        className="
          absolute top-[20%] left-[20%] w-[16px] sm:w-[22px] z-[-5] 
          transition-all duration-[1000ms] ease-[cubic-bezier(0.05,0.83,0.43,0.96)] 
          drop-shadow-[0_0_0_var(--tw-shadow-color)] 
          group-hover:top-[-80%] group-hover:left-[-30%] 
          group-hover:drop-shadow-[0_0_10px_var(--tw-shadow-color)] group-hover:z-[20]
        "
      >
        <Star color={starColor} />
      </div>

      {/* Star 2 */}
      <div
        className="
          absolute top-[45%] left-[45%] w-[10px] sm:w-[14px] z-[-5] 
          transition-all duration-[1000ms] ease-[cubic-bezier(0,0.4,0,1.01)] 
          drop-shadow-[0_0_0_var(--tw-shadow-color)] 
          group-hover:top-[-25%] group-hover:left-[10%] 
          group-hover:drop-shadow-[0_0_10px_var(--tw-shadow-color)] group-hover:z-[20]
        "
      >
        <Star color={starColor} />
      </div>

      {/* Star 3 */}
      <div
        className="
          absolute top-[40%] left-[40%] w-[5px] z-[-5] 
          transition-all duration-[1000ms] ease-[cubic-bezier(0,0.4,0,1.01)] 
          drop-shadow-[0_0_0_var(--tw-shadow-color)] 
          group-hover:top-[55%] group-hover:left-[25%] 
          group-hover:drop-shadow-[0_0_10px_var(--tw-shadow-color)] group-hover:z-[20]
        "
      >
        <Star color={starColor} />
      </div>

      {/* Star 4 */}
      <div
        className="
          absolute top-[20%] left-[40%] w-[6px] sm:w-[8px] z-[-5] 
          transition-all duration-[800ms] ease-[cubic-bezier(0,0.4,0,1.01)] 
          drop-shadow-[0_0_0_var(--tw-shadow-color)] 
          group-hover:top-[30%] group-hover:left-[80%] 
          group-hover:drop-shadow-[0_0_10px_var(--tw-shadow-color)] group-hover:z-[20]
        "
      >
        <Star color={starColor} />
      </div>

      {/* Star 5 */}
      <div
        className="
          absolute top-[25%] left-[45%] w-[10px] sm:w-[14px] z-[-5] 
          transition-all duration-[600ms] ease-[cubic-bezier(0,0.4,0,1.01)] 
          drop-shadow-[0_0_0_var(--tw-shadow-color)] 
          group-hover:top-[25%] group-hover:left-[115%] 
          group-hover:drop-shadow-[0_0_10px_var(--tw-shadow-color)] group-hover:z-[20]
        "
      >
        <Star color={starColor} />
      </div>

      {/* Star 6 */}
      <div
        className="
          absolute top-[5%] left-[50%] w-[5px] z-[-5] 
          transition-all duration-[800ms] ease-in-out 
          drop-shadow-[0_0_0_var(--tw-shadow-color)] 
          group-hover:top-[5%] group-hover:left-[60%] 
          group-hover:drop-shadow-[0_0_10px_var(--tw-shadow-color)] group-hover:z-[20]
        "
      >
        <Star color={starColor} />
      </div>
    </button>
  );
};

const Star = ({ color }: { color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 784.11 815.53"
    className={`w-full h-auto ${color ? '' : 'fill-white'}`}
    style={color ? { fill: color } : undefined}
  >
    <path d="M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z" />
  </svg>
);

export default Button;
