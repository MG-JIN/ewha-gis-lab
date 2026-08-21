"use client";

export default function FilterToggle<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className ?? ""}`}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          aria-pressed={value === item.value}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            value === item.value
              ? "bg-ewha-green-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-ewha-green-50 hover:text-ewha-green-900"
          }`}
        >
          {item.count !== undefined ? `${item.label} (${item.count})` : item.label}
        </button>
      ))}
    </div>
  );
}