import { Validation } from '@/bin/helpers/validators/validation';
import { RequiredFieldValidation } from '@/bin/helpers/validators/required-field-validation';
import { CompareFieldsValidation } from '@/bin/helpers/validators/compare-fields-validation';
import { EmailValidation } from '@/bin/helpers/validators/email-validation';
import { ValidationComposite } from '@/bin/helpers/validators/validation-composite';

export const makeValidationComposite = (
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
