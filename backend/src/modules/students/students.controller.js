import { asyncHandler } from "../../common/http/async-handler.js";
import { sendResponse } from "../../common/http/send-response.js";
import { studentsService } from "./students.service.js";

export const studentsController = {
  list: asyncHandler(async (req, res) => {
    const result = await studentsService.list(req.validated.query);
    sendResponse(res, 200, result.students, result.meta);
  }),

  getById: asyncHandler(async (req, res) => {
    const student = await studentsService.getById(req.validated.params.id);
    sendResponse(res, 200, student);
  }),

  create: asyncHandler(async (req, res) => {
    const student = await studentsService.create(req.validated.body);
    sendResponse(res, 201, student);
  }),

  update: asyncHandler(async (req, res) => {
    const student = await studentsService.update(req.validated.params.id, req.validated.body);
    sendResponse(res, 200, student);
  }),

  deactivate: asyncHandler(async (req, res) => {
    const student = await studentsService.deactivate(req.validated.params.id);
    sendResponse(res, 200, student);
  }),

  listExamResults: asyncHandler(async (req, res) => {
    const results = await studentsService.listExamResults(req.validated.params.id);
    sendResponse(res, 200, results);
  })
};
