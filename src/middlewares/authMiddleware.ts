import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserAttributes } from '../models/User';

interface JwtPayload {
  user: UserAttributes;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default authMiddleware;