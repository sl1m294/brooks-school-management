import { ApiError } from "../../common/errors/api-error.js";
import { studentsRepository } from "./students.repository.js";

const toDate = (value) => (value ? new Date(`${value}T00:00:00.000Z`) : value);

const normalizeStudentInput = (data) => ({
  ...data,
  dateOfBirth: toDate(data.dateOfBirth),
  enrollmentDate: toDate(data.enrollmentDate)
});

const buildStudentWhere = ({ search, gradeLevel, status, section }) => {
  const where = {};

  if (status) {
    where.status = status;
  }

  if (typeof gradeLevel === "number") {
    where.gradeLevel = gradeLevel;
  }

  if (section) {
    where.currentSection = {
      equals: section,
      mode: "insensitive"
    };
  }

  if (search) {
    where.OR = [
      { studentNumber: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ];
  }

  return where;
};

export const studentsService = {
  async list(query) {
    const page = query.page;
    const pageSize = query.pageSize;
    const skip = (page - 1) * pageSize;
    const where = buildStudentWhere(query);
    const { students, total } = await studentsRepository.list({
      where,
      skip,
      take: pageSize
    });

    return {
      students,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  },

  async getById(id) {
    const student = await studentsRepository.findById(id);

    if (!student) {
      throw ApiError.notFound("Student not found");
    }

    return student;
  },

  async create(data) {
    const existingStudent = await studentsRepository.findByStudentNumber(data.studentNumber);

    if (existingStudent) {
      throw ApiError.conflict("A student with this student ID already exists");
    }

    const { primaryGuardian, ...studentData } = data;
    return studentsRepository.create(normalizeStudentInput(studentData), primaryGuardian);
  },

  async update(id, data) {
    await this.getById(id);

    if (data.studentNumber) {
      const existingStudent = await studentsRepository.findByStudentNumber(data.studentNumber);

      if (existingStudent && existingStudent.id !== id) {
        throw ApiError.conflict("A student with this student ID already exists");
      }
    }

    return studentsRepository.update(id, normalizeStudentInput(data));
  },

  async deactivate(id) {
    await this.getById(id);
    return studentsRepository.deactivate(id);
  },

  async listExamResults(id) {
    await this.getById(id);
    const results = await studentsRepository.listExamResults(id);

    return results.map((result) => {
      const score = Number(result.score);
      const maxScore = Number(result.maxScore);
      const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

      return {
        id: result.id,
        examName: result.title,
        subjectCode: result.classSubject.subject.code,
        subjectName: result.classSubject.subject.name,
        score,
        maxScore,
        percentage,
        gradedOn: result.gradedOn,
        comments: result.comments
      };
    });
  }
};
