import { Validation } from '../helpers/validators/validation';

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error[] {
      return null;
    }
  }
  return new ValidationStub();
};
