export default function Header({ title, subtitle, right }: {title: string; subtitle?: string; right?: React.ReactNode}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
