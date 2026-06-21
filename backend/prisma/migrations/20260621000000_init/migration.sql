CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEACHER', 'STAFF');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');
CREATE TYPE "Gender" AS ENUM ('FEMALE', 'MALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY');
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED');
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'WITHDRAWN', 'TRANSFERRED');
CREATE TYPE "GuardianRelationship" AS ENUM ('MOTHER', 'FATHER', 'GUARDIAN', 'GRANDPARENT', 'SIBLING', 'OTHER');
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'HALF_DAY');
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'ATTENDANCE_MARKED', 'GRADE_RECORDED');

CREATE TABLE "users" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "role" "UserRole" NOT NULL,
  "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "last_login_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "refresh_tokens" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "token_hash" VARCHAR(255) NOT NULL,
  "expires_at" TIMESTAMPTZ(6) NOT NULL,
  "revoked_at" TIMESTAMPTZ(6),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "students" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "student_number" VARCHAR(50) NOT NULL,
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "date_of_birth" DATE NOT NULL,
  "gender" "Gender" NOT NULL,
  "address_line_1" VARCHAR(255) NOT NULL,
  "address_line_2" VARCHAR(255),
  "city" VARCHAR(100) NOT NULL,
  "state_province" VARCHAR(100) NOT NULL,
  "postal_code" VARCHAR(30) NOT NULL,
  "country" VARCHAR(100) NOT NULL DEFAULT 'Kenya',
  "email" VARCHAR(255),
  "phone" VARCHAR(50),
  "enrollment_date" DATE NOT NULL,
  "grade_level" INTEGER NOT NULL,
  "current_section" VARCHAR(20),
  "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "guardians" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(255),
  "phone_primary" VARCHAR(50) NOT NULL,
  "phone_secondary" VARCHAR(50),
  "address_line_1" VARCHAR(255),
  "address_line_2" VARCHAR(255),
  "city" VARCHAR(100),
  "state_province" VARCHAR(100),
  "postal_code" VARCHAR(30),
  "country" VARCHAR(100),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "guardians_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "student_guardians" (
  "student_id" UUID NOT NULL,
  "guardian_id" UUID NOT NULL,
  "relationship" "GuardianRelationship" NOT NULL,
  "is_primary" BOOLEAN NOT NULL DEFAULT false,
  "can_pickup" BOOLEAN NOT NULL DEFAULT true,
  "emergency_contact_priority" INTEGER,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "student_guardians_pkey" PRIMARY KEY ("student_id","guardian_id")
);

CREATE TABLE "teachers" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "employee_number" VARCHAR(50) NOT NULL,
  "user_id" UUID,
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "phone" VARCHAR(50),
  "hire_date" DATE NOT NULL,
  "department" VARCHAR(100),
  "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "classes" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" VARCHAR(100) NOT NULL,
  "grade_level" INTEGER NOT NULL,
  "section" VARCHAR(20) NOT NULL,
  "academic_year" VARCHAR(20) NOT NULL,
  "room" VARCHAR(50),
  "capacity" INTEGER,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "subjects" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "code" VARCHAR(30) NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "description" TEXT,
  "credit_hours" DECIMAL(4,2),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "class_subjects" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "class_id" UUID NOT NULL,
  "subject_id" UUID NOT NULL,
  "term" VARCHAR(50) NOT NULL,
  "weight" DECIMAL(5,2) NOT NULL DEFAULT 1.0,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "class_subjects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "teacher_assignments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "teacher_id" UUID NOT NULL,
  "class_subject_id" UUID NOT NULL,
  "starts_on" DATE NOT NULL,
  "ends_on" DATE,
  "is_lead" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "teacher_assignments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "enrollments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "student_id" UUID NOT NULL,
  "class_id" UUID NOT NULL,
  "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
  "starts_on" DATE NOT NULL,
  "ends_on" DATE,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "grades" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "student_id" UUID NOT NULL,
  "class_subject_id" UUID NOT NULL,
  "title" VARCHAR(150) NOT NULL,
  "score" DECIMAL(6,2) NOT NULL,
  "max_score" DECIMAL(6,2) NOT NULL,
  "weight" DECIMAL(5,2) NOT NULL DEFAULT 1.0,
  "graded_on" DATE NOT NULL,
  "comments" TEXT,
  "created_by_id" UUID,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "grades_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "attendance" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "student_id" UUID NOT NULL,
  "class_id" UUID NOT NULL,
  "date" DATE NOT NULL,
  "status" "AttendanceStatus" NOT NULL,
  "notes" TEXT,
  "marked_by_id" UUID,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "audit_logs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "actor_id" UUID,
  "action" "AuditAction" NOT NULL,
  "entity_type" VARCHAR(100) NOT NULL,
  "entity_id" VARCHAR(100),
  "metadata" JSONB,
  "ip_address" VARCHAR(100),
  "user_agent" TEXT,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_status_idx" ON "users"("status");
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");
CREATE UNIQUE INDEX "students_student_number_key" ON "students"("student_number");
CREATE INDEX "students_last_name_first_name_idx" ON "students"("last_name", "first_name");
CREATE INDEX "students_grade_level_current_section_idx" ON "students"("grade_level", "current_section");
CREATE INDEX "students_status_idx" ON "students"("status");
CREATE INDEX "guardians_last_name_first_name_idx" ON "guardians"("last_name", "first_name");
CREATE INDEX "guardians_email_idx" ON "guardians"("email");
CREATE INDEX "student_guardians_guardian_id_idx" ON "student_guardians"("guardian_id");
CREATE UNIQUE INDEX "teachers_employee_number_key" ON "teachers"("employee_number");
CREATE UNIQUE INDEX "teachers_user_id_key" ON "teachers"("user_id");
CREATE UNIQUE INDEX "teachers_email_key" ON "teachers"("email");
CREATE INDEX "teachers_last_name_first_name_idx" ON "teachers"("last_name", "first_name");
CREATE INDEX "teachers_status_idx" ON "teachers"("status");
CREATE UNIQUE INDEX "classes_grade_level_section_academic_year_key" ON "classes"("grade_level", "section", "academic_year");
CREATE INDEX "classes_academic_year_idx" ON "classes"("academic_year");
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");
CREATE INDEX "subjects_name_idx" ON "subjects"("name");
CREATE UNIQUE INDEX "class_subjects_class_id_subject_id_term_key" ON "class_subjects"("class_id", "subject_id", "term");
CREATE INDEX "class_subjects_subject_id_idx" ON "class_subjects"("subject_id");
CREATE UNIQUE INDEX "teacher_assignments_teacher_id_class_subject_id_starts_on_key" ON "teacher_assignments"("teacher_id", "class_subject_id", "starts_on");
CREATE INDEX "teacher_assignments_class_subject_id_idx" ON "teacher_assignments"("class_subject_id");
CREATE UNIQUE INDEX "enrollments_student_id_class_id_starts_on_key" ON "enrollments"("student_id", "class_id", "starts_on");
CREATE INDEX "enrollments_class_id_status_idx" ON "enrollments"("class_id", "status");
CREATE INDEX "enrollments_student_id_status_idx" ON "enrollments"("student_id", "status");
CREATE INDEX "grades_student_id_graded_on_idx" ON "grades"("student_id", "graded_on");
CREATE INDEX "grades_class_subject_id_idx" ON "grades"("class_subject_id");
CREATE UNIQUE INDEX "attendance_student_id_class_id_date_key" ON "attendance"("student_id", "class_id", "date");
CREATE INDEX "attendance_class_id_date_idx" ON "attendance"("class_id", "date");
CREATE INDEX "attendance_student_id_date_idx" ON "attendance"("student_id", "date");
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "student_guardians" ADD CONSTRAINT "student_guardians_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "student_guardians" ADD CONSTRAINT "student_guardians_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "class_subjects" ADD CONSTRAINT "class_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "teacher_assignments" ADD CONSTRAINT "teacher_assignments_class_subject_id_fkey" FOREIGN KEY ("class_subject_id") REFERENCES "class_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "grades" ADD CONSTRAINT "grades_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "grades" ADD CONSTRAINT "grades_class_subject_id_fkey" FOREIGN KEY ("class_subject_id") REFERENCES "class_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
