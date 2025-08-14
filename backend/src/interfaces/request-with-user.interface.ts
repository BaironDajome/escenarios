// src/auth/interfaces/request-with-user.interface.ts
import { Request } from 'express';

export interface JwtPayload {
  id: string;
  email: string;
  tipo: 'cliente' | 'admin';
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
