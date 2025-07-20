import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const EmailValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const email: string = control.value;

    if (!email) {
      return null; // No value, no error
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { invalidEmail: true }; // Invalid email format
    }
    return null;

  };
};
