import { Validation } from '@/bin/helpers/validators/validation';

export class ValidationComposite implements Validation {
  private readonly validations: Validation[];
  constructor(validations: Validation[]) {
    this.validations = validations;
  }
  validate(input: any): Error[] {
    let arrErrors = [];
    for (const validation of this.validations) {
      const error = validation.validate(input);
      if (error) {
        arrErrors.push(error[0].message);
      }
    }
    return arrErrors;
  }
}
