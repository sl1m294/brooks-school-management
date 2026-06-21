import { ApiError } from "../errors/api-error.js";
import { verifyAccessToken } from "../security/jwt.js";

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(ApiError.unauthorized("Missing bearer token"));
    return;
  }

  try {
    const token = authHeader.slice("Bearer ".length);
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};

