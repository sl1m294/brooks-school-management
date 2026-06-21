import { describe, expect, it } from "vitest";
import {
  createStudentSchema,
  getStudentSchema,
  listStudentsSchema,
  updateStudentSchema
} from "../../src/modules/students/students.schemas.js";

const validStudentBody = {
  studentNumber: "STU-1001",
  firstName: "Amina",
  lastName: "Johnson",
  dateOfBirth: "2015-04-10",
  gender: "FEMALE",
  addressLine1: "123 School Street",
  city: "Toronto",
  stateProvince: "Nairobi County",
  postalCode: "00100",
  country: "Kenya",
  email: "amina.johnson@example.com",
  phone: "555-0100",
  enrollmentDate: "2024-09-01",
  gradeLevel: 4,
  currentSection: "A",
  status: "ACTIVE"
};

const validGuardian = {
  firstName: "Grace",
  lastName: "Johnson",
  relationship: "MOTHER",
  email: "grace.johnson@example.com",
  phonePrimary: "+254700000000",
  phoneSecondary: ""
};

describe("student schemas", () => {
  it("accepts a valid create student request", () => {
    const result = createStudentSchema.safeParse({
      body: {
        ...validStudentBody,
        primaryGuardian: validGuardian
      },
      params: {},
      query: {}
    });

    expect(result.success).toBe(true);
  });

  it("rejects non-YYYY-MM-DD date values", () => {
    const result = createStudentSchema.safeParse({
      body: {
        ...validStudentBody,
        dateOfBirth: "04/10/2015"
      },
      params: {},
      query: {}
    });

    expect(result.success).toBe(false);
  });

  it("requires at least one field for update", () => {
    const result = updateStudentSchema.safeParse({
      body: {},
      params: { id: "69d57c68-eaba-4e7f-95d5-b9d67b1dd939" },
      query: {}
    });

    expect(result.success).toBe(false);
  });

  it("coerces list pagination query values", () => {
    const result = listStudentsSchema.safeParse({
      body: {},
      params: {},
      query: {
        page: "2",
        pageSize: "10",
        gradeLevel: "4",
        status: "ACTIVE"
      }
    });

    expect(result.success).toBe(true);
    expect(result.data.query).toMatchObject({
      page: 2,
      pageSize: 10,
      gradeLevel: 4
    });
  });

  it("accepts a valid student id for detail routes", () => {
    const result = getStudentSchema.safeParse({
      body: {},
      params: { id: "69d57c68-eaba-4e7f-95d5-b9d67b1dd939" },
      query: {}
    });

    expect(result.success).toBe(true);
  });
});
