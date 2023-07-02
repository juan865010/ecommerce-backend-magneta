import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const VerifyRol = (role: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }

    try {
      const decodedToken = jwt.verify(token, 'secretKey') as { UserId: string, role: string };

      if (!role.includes(decodedToken.role)) {
        return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
      }
      req.userId = decodedToken.UserId;
      console.log(req)
      next();
    } catch (error) {
      console.error('Error en la verificación del token:', error);
      res.status(401).json({ message: 'Acceso no autorizado' });
    }
  };
}