import { Validation } from '@/bin/helpers/validators/validation';
import { MissingParamError } from '@/bin/errors';

export class RequiredFieldValidation implements Validation {
  private readonly fieldName: string;
  constructor(fieldName: string) {
    this.fieldName = fieldName;
  }
  validate(input: any): Error[] {
    if (!input[this.fieldName]) {
      return [new MissingParamError(this.fieldName)];
    }
  }
}
