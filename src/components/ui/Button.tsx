import type { ButtonProps } from "../../lib/types";

const Button = ({
  children,
  onClick,
  variant = "default",
  className = "",
  ...rest
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow active:bg-blue-800",
    outline:
      "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 hover:border-blue-700 hover:text-blue-700",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow active:bg-red-800",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 shadow-sm hover:shadow active:bg-gray-400",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow active:bg-green-800",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
