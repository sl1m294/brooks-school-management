import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, SlidersHorizontal, UserPlus, UsersRound } from "lucide-react";
import { createStudent, listStudents } from "../../api/students.js";
import { StatusBadge } from "../../components/ui/StatusBadge.jsx";
import { emptyStudentForm, StudentFormModal } from "./StudentFormModal.jsx";

const classOptions = ["", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const statusOptions = ["", "ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED"];

const formatDate = (value) => {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
};

export function StudentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyStudentForm);

  const filters = useMemo(
    () => ({
      search,
      gradeLevel,
      status,
      page: 1,
      pageSize: 20
    }),
    [search, gradeLevel, status]
  );

  const studentsQuery = useQuery({
    queryKey: ["students", filters],
    queryFn: () => listStudents(filters)
  });

  const students = studentsQuery.data?.data ?? [];
  const meta = studentsQuery.data?.meta;

  const createStudentMutation = useMutation({
    mutationFn: createStudent,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setForm(emptyStudentForm);
      setIsFormOpen(false);
      setStatus("ACTIVE");
    }
  });

  const handleOpenForm = () => {
    setForm(emptyStudentForm);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    if (!createStudentMutation.isPending) {
      setIsFormOpen(false);
      createStudentMutation.reset();
    }
  };

  const handleCreateStudent = (event) => {
    event.preventDefault();
    createStudentMutation.mutate({
      studentNumber: form.studentNumber,
      firstName: form.firstName,
      lastName: form.lastName,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2 || null,
      city: form.city,
      stateProvince: form.stateProvince,
      postalCode: form.postalCode,
      country: form.country,
      email: null,
      phone: null,
      enrollmentDate: form.enrollmentDate,
      gradeLevel: Number(form.gradeLevel),
      currentSection: form.currentSection || null,
      status: form.status,
      primaryGuardian: {
        firstName: form.guardianFirstName,
        lastName: form.guardianLastName,
        relationship: form.guardianRelationship,
        email: form.guardianEmail || null,
        phonePrimary: form.guardianPhonePrimary,
        phoneSecondary: form.guardianPhoneSecondary || null
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">Student records</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink-900">Students</h1>
        </div>

        <button
          type="button"
          onClick={handleOpenForm}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-meadow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-meadow-700"
        >
          <UserPlus size={18} aria-hidden="true" />
          Add student
        </button>
      </div>

      <section className="rounded-lg border border-ink-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_190px]">
          <label className="block">
            <span className="sr-only">Search students</span>
            <span className="flex min-h-11 items-center gap-2 rounded-md border border-ink-200 bg-ink-50 px-3">
              <Search size={18} className="text-ink-500" aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full border-0 bg-transparent text-sm text-ink-900 outline-none"
                placeholder="Search by name, student ID, or email"
              />
            </span>
          </label>

          <label className="block">
            <span className="sr-only">Class level</span>
            <select
              value={gradeLevel}
              onChange={(event) => setGradeLevel(event.target.value)}
              className="min-h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-900"
            >
              {classOptions.map((classLevel) => (
                <option key={classLevel || "all"} value={classLevel}>
                  {classLevel ? `Class ${classLevel}` : "All classes"}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="min-h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-900"
            >
              {statusOptions.map((option) => (
                <option key={option || "all"} value={option}>
                  {option || "All statuses"}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-ink-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-ink-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-meadow-50 text-meadow-700">
              <UsersRound size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-ink-900">Student list</h2>
              <p className="text-sm text-ink-500">
                {meta ? `${meta.total} record${meta.total === 1 ? "" : "s"}` : "Loading records"}
              </p>
            </div>
          </div>
          <SlidersHorizontal size={19} className="text-ink-500" aria-hidden="true" />
        </div>

        {studentsQuery.isLoading ? (
          <div className="px-4 py-12 text-center text-sm text-ink-500">Loading students...</div>
        ) : studentsQuery.isError ? (
          <div className="px-4 py-12 text-center text-sm text-red-700">{studentsQuery.error.message}</div>
        ) : students.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="font-medium text-ink-900">No students found</p>
            <p className="mt-1 text-sm text-ink-500">Try changing the search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-200">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-ink-500">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-ink-500">Student ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-ink-500">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-ink-500">Enrollment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-ink-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 bg-white">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-ink-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-ink-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="mt-1 text-sm text-ink-500">{student.email || "No email on file"}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-ink-700">{student.studentNumber}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-ink-700">
                      Class {student.gradeLevel}
                      {student.currentSection ? `, Stream ${student.currentSection}` : ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-ink-700">
                      {formatDate(student.enrollmentDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <StatusBadge status={student.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isFormOpen ? (
        <StudentFormModal
          form={form}
          onChange={setForm}
          onClose={handleCloseForm}
          onSubmit={handleCreateStudent}
          isSaving={createStudentMutation.isPending}
          errorMessage={createStudentMutation.isError ? createStudentMutation.error.message : ""}
        />
      ) : null}
    </div>
  );
}
