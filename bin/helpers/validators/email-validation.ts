import { Validation } from './validation';
import { InvalidParamError } from '../../errors';

export class EmailValidation implements Validation {
  private readonly fieldName: string;
  constructor(fieldName: string) {
    this.fieldName = fieldName;
  }
  validate(input: any): Error[] {
    const reg = new RegExp(/^\w+([-+,']\w+)*@\w+([-,]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(input[this.fieldName])) {
      return [new InvalidParamError(this.fieldName)];
    }
  }
}
