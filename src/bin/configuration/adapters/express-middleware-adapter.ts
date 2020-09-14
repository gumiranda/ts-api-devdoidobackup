import { Request, Response, NextFunction } from 'express';
import { HttpRequest } from '@/bin/protocols/http';
import { Middleware } from '@/bin/middlewares/protocols/middleware';

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers,
    };

    const httpResponse = await middleware.handle(httpRequest);
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body);
      next();
    } else {
      if (httpResponse?.body?.message) {
        res.status(httpResponse.statusCode).json({
          error: httpResponse.body.message,
        });
      } else {
        res.status(httpResponse.statusCode).json({
          error: httpResponse.body,
        });
      }
    }
  };
};
