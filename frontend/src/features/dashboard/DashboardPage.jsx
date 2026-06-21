import { BookOpen, CalendarCheck, GraduationCap, UsersRound } from "lucide-react";

const metrics = [
  { label: "Students", value: "1", icon: UsersRound },
  { label: "Teachers", value: "0", icon: GraduationCap },
  { label: "Classes", value: "0", icon: BookOpen },
  { label: "Attendance today", value: "Not marked", icon: CalendarCheck }
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink-900">Dashboard</h1>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-lg border border-ink-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-ink-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-ink-900">{metric.value}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-meadow-50 text-meadow-700">
                <metric.icon size={22} aria-hidden="true" />
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

