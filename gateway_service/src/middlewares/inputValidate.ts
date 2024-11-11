import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateUserInput = [
  // Username validation (non-empty, alphanumeric)
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers"),

  // Password validation
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^[A-Za-z0-9!?.@#%^&*-]+$/)
    .withMessage("Password contains invalid characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[!?.@#%^&*-]/)
    .withMessage(
      "Password must contain at least one special character (!?.@#%^&*-)"
    ),

  // Handle validation result
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
