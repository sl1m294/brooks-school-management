import { prisma } from "../../database/prisma.js";

const studentInclude = {
  guardians: {
    include: {
      guardian: true
    },
    orderBy: [
      { isPrimary: "desc" },
      { emergencyContactPriority: "asc" }
    ]
  }
};

export const studentsRepository = {
  async list({ where, skip, take }) {
    const [students, total] = await prisma.$transaction([
      prisma.student.findMany({
        where,
        skip,
        take,
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        include: studentInclude
      }),
      prisma.student.count({ where })
    ]);

    return { students, total };
  },

  findById(id) {
    return prisma.student.findUnique({
      where: { id },
      include: studentInclude
    });
  },

  findByStudentNumber(studentNumber) {
    return prisma.student.findUnique({
      where: { studentNumber }
    });
  },

  create(data, primaryGuardian) {
    return prisma.student.create({
      data: {
        ...data,
        ...(primaryGuardian
          ? {
              guardians: {
                create: {
                  relationship: primaryGuardian.relationship,
                  isPrimary: true,
                  canPickup: true,
                  emergencyContactPriority: 1,
                  guardian: {
                    create: {
                      firstName: primaryGuardian.firstName,
                      lastName: primaryGuardian.lastName,
                      email: primaryGuardian.email,
                      phonePrimary: primaryGuardian.phonePrimary,
                      phoneSecondary: primaryGuardian.phoneSecondary
                    }
                  }
                }
              }
            }
          : {})
      },
      include: studentInclude
    });
  },

  update(id, data) {
    return prisma.student.update({
      where: { id },
      data,
      include: studentInclude
    });
  },

  deactivate(id) {
    return prisma.student.update({
      where: { id },
      data: { status: "INACTIVE" },
      include: studentInclude
    });
  },

  listExamResults(studentId) {
    return prisma.grade.findMany({
      where: { studentId },
      orderBy: [{ gradedOn: "desc" }, { title: "asc" }],
      include: {
        classSubject: {
          include: {
            subject: true
          }
        }
      }
    });
  }
};
