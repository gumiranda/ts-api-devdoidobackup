import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import {
  badRequest,
  serverError,
  noContent,
  ok,
} from '@/bin/helpers/http-helper';
import { UpdateRequest } from '../../usecases/update-request/update-request';
import { putOk } from '../../../../bin/helpers/http-helper';

export class UpdateRequestController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly updateRequest: UpdateRequest,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      const { requestId } = httpRequest.params;
      const { read } = httpRequest.body;

      const request = await this.updateRequest.updateRequest(
        {
          read,
        },
        requestId,
      );
      return request ? putOk(request) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
