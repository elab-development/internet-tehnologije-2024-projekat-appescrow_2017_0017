type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; };
export default function Input({ label, hint, className="", ...props }: Props) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>}
      <input
        className={`w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none ${className}`}
        {...props}
      />
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}
