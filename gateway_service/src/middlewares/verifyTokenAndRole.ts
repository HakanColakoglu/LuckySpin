import { Request, Response, NextFunction } from "express";
import verifyToken from "./verifyToken";

export const validateTokenAndRole = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await verifyToken(req, res, async (err) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (req.user && requiredRoles.includes(req.user.role)) {
        next();
      } else {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }
    });
  };
};
