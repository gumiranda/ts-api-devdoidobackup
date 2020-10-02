import { Controller } from '@/bin/protocols/controller';
import { HttpRequest, HttpResponse } from '@/bin/protocols/http';
import { Validation } from '@/bin/helpers/validators/validation';
import {
  badRequest,
  serverError,
  noContent,
  createdOk,
} from '@/bin/helpers/http-helper';
import { AddCategory } from '../../usecases/add-category/add-category';

export class AddCategoryController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addCategory: AddCategory,
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      const { name } = httpRequest.body;
      const category = await this.addCategory.add({
        name,
        active: false,
        createdAt: new Date(),
      });
      return category ? createdOk(category) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
