type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};
export default function Button({ variant="primary", size="md", className="", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-xl font-medium transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
  }[size];
  const variants = {
    primary:  "bg-gray-900 text-white hover:opacity-90 focus:ring-gray-900/30",
    secondary:"bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-gray-400/30",
    ghost:    "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400/30",
    danger:   "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600/30",
  }[variant];
  return <button className={`${base} ${sizes} ${variants} ${className}`} {...props} />;
}
