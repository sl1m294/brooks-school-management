import { asyncHandler } from "../../common/http/async-handler.js";
import { sendResponse } from "../../common/http/send-response.js";
import { authService } from "./auth.service.js";

export const authController = {
  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.validated.body);
    sendResponse(res, 200, result);
  }),

  me: asyncHandler(async (req, res) => {
    sendResponse(res, 200, authService.getCurrentUser(req.user));
  })
};

