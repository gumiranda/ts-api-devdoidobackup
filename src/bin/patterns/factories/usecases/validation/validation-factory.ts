import { Validation } from '../../../../helpers/validators/validation';
import { RequiredFieldValidation } from '../../../../helpers/validators/required-field-validation';
import { CompareFieldsValidation } from '../../../../helpers/validators/compare-fields-validation';
import { EmailValidation } from '../../../../helpers/validators/email-validation';
import { ValidationComposite } from '../../../../helpers/validators/validation-composite';

export const mockValidationComposite = (
  requiredFields: Array<string>,
): Validation => {
  const validations: Validation[] = [];
  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field));
  }
  if (requiredFields.includes('passwordConfirmation')) {
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation'),
    );
  }
  if (requiredFields.includes('email')) {
    validations.push(new EmailValidation('email'));
  }
  return new ValidationComposite(validations);
};
