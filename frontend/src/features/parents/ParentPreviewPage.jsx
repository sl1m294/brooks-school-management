import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Clock,
  GraduationCap,
  Home,
  MessageSquareText,
  Trophy
} from "lucide-react";
import { Link } from "react-router-dom";
import { listStudentExamResults, listStudents } from "../../api/students.js";

const formatClassLabel = (student) => {
  if (!student) return "Class not assigned";
  return `Class ${student.gradeLevel}${student.currentSection ? `, Stream ${student.currentSection}` : ""}`;
};

export function ParentPreviewPage() {
  const studentsQuery = useQuery({
    queryKey: ["parent-preview-student"],
    queryFn: () => listStudents({ page: 1, pageSize: 1, status: "ACTIVE" })
  });

  const student = studentsQuery.data?.data?.[0];
  const examResultsQuery = useQuery({
    queryKey: ["student-exam-results", student?.id],
    queryFn: () => listStudentExamResults(student.id),
    enabled: Boolean(student?.id)
  });

  const examResults = examResultsQuery.data ?? [];

  return (
    <main className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-meadow-600 text-white">
              <GraduationCap size={24} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">Brooks School Parent Portal</p>
              <p className="text-xs text-ink-500">Parent preview</p>
            </div>
          </div>

          <Link
            to="/students"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Admin view
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-ink-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">My child</p>
            {studentsQuery.isLoading ? (
              <div className="mt-8 text-sm text-ink-500">Loading parent view...</div>
            ) : (
              <>
                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-meadow-50 text-2xl font-semibold text-meadow-700">
                    {student ? `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}` : "ST"}
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold text-ink-900">
                      {student ? `${student.firstName} ${student.lastName}` : "Student Name"}
                    </h1>
                    <p className="mt-2 text-base text-ink-600">{formatClassLabel(student)}</p>
                    <p className="mt-1 text-sm text-ink-500">
                      Admission No: {student?.studentNumber ?? "Not available"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-ink-200 bg-ink-50 p-4">
                    <div className="flex items-center gap-2 text-meadow-700">
                      <CheckCircle2 size={18} aria-hidden="true" />
                      <p className="text-sm font-semibold">Attendance</p>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-ink-900">Present</p>
                    <p className="mt-1 text-sm text-ink-500">Today</p>
                  </div>
                  <div className="rounded-lg border border-ink-200 bg-ink-50 p-4">
                    <div className="flex items-center gap-2 text-meadow-700">
                      <BookOpen size={18} aria-hidden="true" />
                      <p className="text-sm font-semibold">Homework</p>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-ink-900">2</p>
                    <p className="mt-1 text-sm text-ink-500">Due this week</p>
                  </div>
                  <div className="rounded-lg border border-ink-200 bg-ink-50 p-4">
                    <div className="flex items-center gap-2 text-meadow-700">
                      <Clock size={18} aria-hidden="true" />
                      <p className="text-sm font-semibold">Next item</p>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-ink-900">Fri</p>
                    <p className="mt-1 text-sm text-ink-500">Class meeting</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <aside className="rounded-lg border border-ink-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">Quick actions</p>
            <div className="mt-5 space-y-3">
              {[
                { icon: MessageSquareText, title: "Message class teacher", text: "Ask a question or share an update." },
                { icon: CalendarCheck, title: "View attendance", text: "Check daily attendance history." },
                { icon: Home, title: "Update contacts", text: "Keep phone and home details current." }
              ].map((item) => (
                <button
                  key={item.title}
                  type="button"
                  className="flex w-full items-start gap-3 rounded-lg border border-ink-200 bg-white p-4 text-left transition hover:bg-ink-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-meadow-50 text-meadow-700">
                    <item.icon size={19} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink-900">{item.title}</span>
                    <span className="mt-1 block text-sm text-ink-500">{item.text}</span>
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <article className="rounded-lg border border-ink-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">Academics</p>
                <h2 className="mt-1 text-lg font-semibold text-ink-900">Exam results</h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-meadow-50 text-meadow-700">
                <Trophy size={20} aria-hidden="true" />
              </div>
            </div>

            {examResultsQuery.isLoading ? (
              <div className="mt-6 text-sm text-ink-500">Loading exam results...</div>
            ) : examResults.length === 0 ? (
              <div className="mt-6 rounded-lg border border-ink-200 bg-ink-50 p-4">
                <p className="text-sm font-medium text-ink-900">No exam results posted yet</p>
                <p className="mt-1 text-sm text-ink-500">
                  Results will appear here when teachers record them.
                </p>
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full divide-y divide-ink-200">
                  <thead className="bg-ink-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-ink-500">Exam</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-ink-500">Subject</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-ink-500">Score</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-ink-500">Percent</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-ink-500">Comment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {examResults.map((result) => (
                      <tr key={result.id}>
                        <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-ink-900">
                          {result.examName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-ink-700">
                          {result.subjectName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-ink-700">
                          {result.score}/{result.maxScore}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm font-semibold text-meadow-700">
                          {result.percentage}%
                        </td>
                        <td className="px-3 py-3 text-sm text-ink-600">{result.comments || "No comment"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          <article className="rounded-lg border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-ink-900">Latest update</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Your child was marked present today. Mathematics homework has been assigned and is due on Friday.
            </p>
          </article>
          <article className="rounded-lg border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-ink-900">Fee balance</h2>
            <p className="mt-3 text-3xl font-semibold text-ink-900">KES 0</p>
            <p className="mt-1 text-sm text-ink-500">No outstanding balance in this preview.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
