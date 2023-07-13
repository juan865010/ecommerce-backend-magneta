import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken'

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const VerifyRol = (role: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized access' });
    }

    try {
      const decodedToken = jwt.verify(token, 'secretKey') as { UserId: string, role: string };

      if (!role.includes(decodedToken.role)) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'You do not have permission to perform this action' });
      }
      req.userId = decodedToken.UserId;
      console.log(req)
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized access' });
      return
    }
  };
}