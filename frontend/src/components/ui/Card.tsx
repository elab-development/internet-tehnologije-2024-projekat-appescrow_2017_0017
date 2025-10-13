export default function Card({ children, className="" }: {children: React.ReactNode; className?: string}) {
  return <div className={`rounded-2xl bg-white shadow-sm border border-gray-100 p-4 ${className}`}>{children}</div>;
}
