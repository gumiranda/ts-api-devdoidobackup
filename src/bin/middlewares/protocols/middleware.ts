import { HttpRequest, HttpResponse } from '../../protocols/http';

export interface Middleware {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
