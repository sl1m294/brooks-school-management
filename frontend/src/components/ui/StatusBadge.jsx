const statusStyles = {
  ACTIVE: "bg-meadow-100 text-meadow-700",
  INACTIVE: "bg-ink-100 text-ink-700",
  GRADUATED: "bg-sun-100 text-ink-900",
  TRANSFERRED: "bg-blue-100 text-blue-800"
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex min-w-20 items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[status] ?? "bg-ink-100 text-ink-700"
      }`}
    >
      {status}
    </span>
  );
}

