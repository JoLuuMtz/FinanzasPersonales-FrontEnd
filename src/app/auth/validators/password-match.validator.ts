import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PassWordMatchValidator = (pass: string, confirm: string ): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    {
      const password = control.get(pass)?.value
      const confirmPassword = control.get(confirm)?.value;

      if (!password || !confirmPassword ) {
        return null;
      }

      if ( password !== confirmPassword) {
        return {  passwordNotMatch : true }; // Si las contraseñas no coinciden, retorna un error
      }
      return null; // Si las contraseñas coinciden, no hay errores
    }
  };
};
