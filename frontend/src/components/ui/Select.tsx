type Props = React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; };
export default function Select({ label, className="", children, ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>}
      <select
        className={`w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
