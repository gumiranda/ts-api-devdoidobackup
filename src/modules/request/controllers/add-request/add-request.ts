import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import {
  badRequest,
  serverError,
  noContent,
  createdOk,
} from '@/bin/helpers/http-helper';
import { AddRequest } from '../../usecases/add-request/add-request';

export class AddRequestController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addRequest: AddRequest,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      const { content, type, userFor } = httpRequest.body;
      const { userId } = httpRequest;

      const request = await this.addRequest.add({
        userBy: userId,
        content,
        userFor,
        type,
        read: false,
        createdAt: new Date(),
      });
      return request ? createdOk(request) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
