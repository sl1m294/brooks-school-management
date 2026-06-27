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
      <div className="rounded-[24px] bg-gradient-to-br from-meadow-600 to-ink-900 p-6 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wide text-sun-500">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-white">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/68">
          Daily operations for Brooks School: learners, classes, attendance, and parent communication.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-[22px] border border-ink-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-ink-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold text-ink-900">{metric.value}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-meadow-50 text-meadow-700">
                <metric.icon size={22} aria-hidden="true" />
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
