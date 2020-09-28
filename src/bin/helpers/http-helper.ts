import { HttpResponse } from '@/bin/protocols/http';
import { ServerError } from '@/bin/errors';
import { UnauthorizedError } from '@/bin/errors/unauthorized-error';

export const badRequest = (error: any): HttpResponse => ({
  statusCode: 400,
  body: error,
});
export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError(),
});
export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error,
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack),
});

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
});
export const putOk = (data: any): HttpResponse => ({
  statusCode: 202,
  body: data,
});
export const createdOk = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data,
});
export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null,
});
