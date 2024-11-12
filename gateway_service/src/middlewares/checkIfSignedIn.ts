import { Request, Response, NextFunction } from "express";
import verifyToken from "./verifyToken";

const checkIfSignedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next();
  }
  try {
    await verifyToken(req, res, () => {
      return res.status(400).json({ message: "Already signed in" });
    });
  } catch (err) {
    next();
  }
};

export default checkIfSignedIn;
