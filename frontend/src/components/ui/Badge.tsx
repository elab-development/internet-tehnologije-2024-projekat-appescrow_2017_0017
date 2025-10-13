export default function Badge({ children, color="gray" }: {children: React.ReactNode; color?: "gray"|"green"|"yellow"|"red"}) {
  const map = {
    gray:   "bg-gray-100 text-gray-800",
    green:  "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red:    "bg-red-100 text-red-800",
  }[color];
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map}`}>{children}</span>;
}
