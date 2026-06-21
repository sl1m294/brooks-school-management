import { Router } from "express";
import { requireAuth } from "../../common/middleware/require-auth.js";
import { validateRequest } from "../../common/middleware/validate-request.js";
import { authController } from "./auth.controller.js";
import { loginSchema } from "./auth.schemas.js";

export const authRoutes = Router();

authRoutes.post("/login", validateRequest(loginSchema), authController.login);
authRoutes.get("/me", requireAuth, authController.me);

