export default function EmptyState({ title, subtitle, action }: {title: string; subtitle?: string; action?: React.ReactNode}) {
  return (
    <div className="text-center p-10 border border-dashed border-gray-300 rounded-2xl bg-gray-50">
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
