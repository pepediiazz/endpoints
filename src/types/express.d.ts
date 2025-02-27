import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Agregamos la propiedad userId
    }
  }
}
export { Request };
