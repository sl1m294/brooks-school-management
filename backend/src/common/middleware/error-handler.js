import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { ApiError } from "../errors/api-error.js";

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        details: error.details
      }
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        message: "Validation failed",
        details: error.flatten()
      }
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(409).json({
        error: {
          message: "A record with this unique value already exists",
          details: error.meta
        }
      });
      return;
    }
  }

  console.error(error);
  res.status(500).json({
    error: {
      message: "Internal server error"
    }
  });
};

