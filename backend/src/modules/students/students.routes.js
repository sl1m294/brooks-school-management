import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { requireRole } from "../../common/middleware/require-role.js";
import { validateRequest } from "../../common/middleware/validate-request.js";
import { studentsController } from "./students.controller.js";
import {
  createStudentSchema,
  getStudentSchema,
  listStudentsSchema,
  updateStudentSchema
} from "./students.schemas.js";

export const studentRoutes = Router();

studentRoutes.use(requireAuth);

studentRoutes.get("/", validateRequest(listStudentsSchema), studentsController.list);
studentRoutes.get(
  "/:id/exam-results",
  validateRequest(getStudentSchema),
  studentsController.listExamResults
);
studentRoutes.get("/:id", validateRequest(getStudentSchema), studentsController.getById);

studentRoutes.post(
  "/",
  requireRole("ADMIN", "STAFF"),
  validateRequest(createStudentSchema),
  studentsController.create
);

studentRoutes.patch(
  "/:id",
  requireRole("ADMIN", "STAFF"),
  validateRequest(updateStudentSchema),
  studentsController.update
);

studentRoutes.delete(
  "/:id",
  requireRole("ADMIN"),
  validateRequest(getStudentSchema),
  studentsController.deactivate
);
