import { HttpRequest, HttpResponse } from '@/bin/protocols/http';

export interface Middleware {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
