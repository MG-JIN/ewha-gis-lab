export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-gray-200 p-6 shadow-sm ${className ?? "bg-white"}`}
    >
      {children}
    </div>
  );
}
