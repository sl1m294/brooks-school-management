import { X } from "lucide-react";

const classOptions = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const genderOptions = [
  { value: "FEMALE", label: "Female" },
  { value: "MALE", label: "Male" },
  { value: "NON_BINARY", label: "Non-binary" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" }
];
const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "TRANSFERRED", label: "Transferred" },
  { value: "GRADUATED", label: "Graduated" }
];
const relationshipOptions = [
  { value: "MOTHER", label: "Mother" },
  { value: "FATHER", label: "Father" },
  { value: "GUARDIAN", label: "Guardian" },
  { value: "GRANDPARENT", label: "Grandparent" },
  { value: "SIBLING", label: "Sibling" },
  { value: "OTHER", label: "Other" }
];

export const emptyStudentForm = {
  studentNumber: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "FEMALE",
  addressLine1: "",
  addressLine2: "",
  city: "",
  stateProvince: "",
  postalCode: "",
  country: "Kenya",
  enrollmentDate: new Date().toISOString().slice(0, 10),
  gradeLevel: "1",
  currentSection: "",
  status: "ACTIVE",
  guardianFirstName: "",
  guardianLastName: "",
  guardianRelationship: "MOTHER",
  guardianEmail: "",
  guardianPhonePrimary: "",
  guardianPhoneSecondary: ""
};

function Field({ label, children, span = "" }) {
  return (
    <label className={`block ${span}`}>
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

const inputClass =
  "min-h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none transition focus:border-meadow-600";

export function StudentFormModal({
  form,
  onChange,
  onClose,
  onSubmit,
  isSaving,
  errorMessage
}) {
  const updateField = (field, value) => {
    onChange({
      ...form,
      [field]: value
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink-900/45 px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl rounded-lg border border-ink-200 bg-white shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-ink-200 px-5 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-meadow-700">New learner</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink-900">Add student</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-ink-200 bg-white text-ink-700 transition hover:bg-ink-50"
            aria-label="Close form"
            title="Close"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-5 py-5">
          <div className="space-y-6">
            <section>
              <h3 className="text-base font-semibold text-ink-900">Learner details</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Field label="Admission No">
                  <input
                    className={inputClass}
                    value={form.studentNumber}
                    onChange={(event) => updateField("studentNumber", event.target.value)}
                    placeholder="ADM-001"
                    required
                  />
                </Field>
                <Field label="First name">
                  <input
                    className={inputClass}
                    value={form.firstName}
                    onChange={(event) => updateField("firstName", event.target.value)}
                    required
                  />
                </Field>
                <Field label="Last name">
                  <input
                    className={inputClass}
                    value={form.lastName}
                    onChange={(event) => updateField("lastName", event.target.value)}
                    required
                  />
                </Field>
                <Field label="Date of birth">
                  <input
                    className={inputClass}
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(event) => updateField("dateOfBirth", event.target.value)}
                    required
                  />
                </Field>
                <Field label="Gender">
                  <select
                    className={inputClass}
                    value={form.gender}
                    onChange={(event) => updateField("gender", event.target.value)}
                  >
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Status">
                  <select
                    className={inputClass}
                    value={form.status}
                    onChange={(event) => updateField("status", event.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </section>

            <section>
              <h3 className="text-base font-semibold text-ink-900">Class placement</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Field label="Class">
                  <select
                    className={inputClass}
                    value={form.gradeLevel}
                    onChange={(event) => updateField("gradeLevel", event.target.value)}
                  >
                    {classOptions.map((classLevel) => (
                      <option key={classLevel} value={classLevel}>
                        Class {classLevel}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Stream">
                  <input
                    className={inputClass}
                    value={form.currentSection}
                    onChange={(event) => updateField("currentSection", event.target.value)}
                    placeholder="A"
                  />
                </Field>
                <Field label="Enrollment date">
                  <input
                    className={inputClass}
                    type="date"
                    value={form.enrollmentDate}
                    onChange={(event) => updateField("enrollmentDate", event.target.value)}
                    required
                  />
                </Field>
              </div>
            </section>

            <section>
              <h3 className="text-base font-semibold text-ink-900">Parent/guardian</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Field label="First name">
                  <input
                    className={inputClass}
                    value={form.guardianFirstName}
                    onChange={(event) => updateField("guardianFirstName", event.target.value)}
                    required
                  />
                </Field>
                <Field label="Last name">
                  <input
                    className={inputClass}
                    value={form.guardianLastName}
                    onChange={(event) => updateField("guardianLastName", event.target.value)}
                    required
                  />
                </Field>
                <Field label="Relationship">
                  <select
                    className={inputClass}
                    value={form.guardianRelationship}
                    onChange={(event) => updateField("guardianRelationship", event.target.value)}
                  >
                    {relationshipOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Primary phone">
                  <input
                    className={inputClass}
                    value={form.guardianPhonePrimary}
                    onChange={(event) => updateField("guardianPhonePrimary", event.target.value)}
                    placeholder="+254..."
                    required
                  />
                </Field>
                <Field label="Alternative phone">
                  <input
                    className={inputClass}
                    value={form.guardianPhoneSecondary}
                    onChange={(event) => updateField("guardianPhoneSecondary", event.target.value)}
                    placeholder="Optional"
                  />
                </Field>
                <Field label="Email">
                  <input
                    className={inputClass}
                    type="email"
                    value={form.guardianEmail}
                    onChange={(event) => updateField("guardianEmail", event.target.value)}
                    placeholder="Optional"
                  />
                </Field>
              </div>
            </section>

            <section>
              <h3 className="text-base font-semibold text-ink-900">Home address</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="Address" span="md:col-span-2">
                  <input
                    className={inputClass}
                    value={form.addressLine1}
                    onChange={(event) => updateField("addressLine1", event.target.value)}
                    placeholder="Estate, road, or home area"
                    required
                  />
                </Field>
                <Field label="Address line 2" span="md:col-span-2">
                  <input
                    className={inputClass}
                    value={form.addressLine2}
                    onChange={(event) => updateField("addressLine2", event.target.value)}
                    placeholder="Optional"
                  />
                </Field>
                <Field label="Town/City">
                  <input
                    className={inputClass}
                    value={form.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    placeholder="Nairobi"
                    required
                  />
                </Field>
                <Field label="County">
                  <input
                    className={inputClass}
                    value={form.stateProvince}
                    onChange={(event) => updateField("stateProvince", event.target.value)}
                    placeholder="Nairobi County"
                    required
                  />
                </Field>
                <Field label="Postal code">
                  <input
                    className={inputClass}
                    value={form.postalCode}
                    onChange={(event) => updateField("postalCode", event.target.value)}
                    placeholder="00100"
                    required
                  />
                </Field>
                <Field label="Country">
                  <input
                    className={inputClass}
                    value={form.country}
                    onChange={(event) => updateField("country", event.target.value)}
                    required
                  />
                </Field>
              </div>
            </section>
          </div>

          {errorMessage ? (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-ink-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-meadow-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-meadow-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Saving student..." : "Save student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
