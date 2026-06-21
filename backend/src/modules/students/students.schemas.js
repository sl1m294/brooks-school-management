import { z } from "zod";
import { paginationQuerySchema, uuidParamSchema } from "../../common/validation/common-schemas.js";

const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format");

const studentBaseSchema = z.object({
  studentNumber: z.string().trim().min(1).max(50),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  dateOfBirth: dateStringSchema,
  gender: z.enum(["FEMALE", "MALE", "NON_BINARY", "PREFER_NOT_TO_SAY"]),
  addressLine1: z.string().trim().min(1).max(255),
  addressLine2: z.string().trim().max(255).optional().nullable(),
  city: z.string().trim().min(1).max(100),
  stateProvince: z.string().trim().min(1).max(100),
  postalCode: z.string().trim().min(1).max(30),
  country: z.string().trim().min(1).max(100).default("Kenya"),
  email: z.string().email().trim().toLowerCase().optional().nullable(),
  phone: z.string().trim().max(50).optional().nullable(),
  enrollmentDate: dateStringSchema,
  gradeLevel: z.number().int().min(0).max(12),
  currentSection: z.string().trim().max(20).optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED"]).default("ACTIVE")
});

const primaryGuardianSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  relationship: z.enum(["MOTHER", "FATHER", "GUARDIAN", "GRANDPARENT", "SIBLING", "OTHER"]),
  email: z.string().email().trim().toLowerCase().optional().nullable(),
  phonePrimary: z.string().trim().min(1).max(50),
  phoneSecondary: z.string().trim().max(50).optional().nullable()
});

export const createStudentSchema = z.object({
  body: studentBaseSchema.extend({
    primaryGuardian: primaryGuardianSchema.optional()
  }),
  params: z.object({}),
  query: z.object({})
});

export const updateStudentSchema = z.object({
  body: studentBaseSchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  }),
  params: uuidParamSchema,
  query: z.object({})
});

export const getStudentSchema = z.object({
  body: z.object({}),
  params: uuidParamSchema,
  query: z.object({})
});

export const listStudentsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: paginationQuerySchema.extend({
    search: z.string().trim().optional(),
    gradeLevel: z.coerce.number().int().min(0).max(12).optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED"]).optional(),
    section: z.string().trim().optional()
  })
});
