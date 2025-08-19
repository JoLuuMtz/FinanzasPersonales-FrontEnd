import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';




@Injectable({ providedIn: 'root' })
export class FormValidService {
  constructor() {}

  // ================================
  // MÉTODOS DE VALIDACIÓN DE FORMULARIOS
  // ================================

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  hasServerErrors(form: FormGroup, fieldName: string): boolean {
    return !!form.get(fieldName)?.errors?.['serverError'];
  }

  getServerErrorMessage(form: FormGroup, fieldName: string): string | null {
    return form.get(fieldName)?.errors?.['serverError'] || null;
  }

  getFieldError(form: FormGroup, fieldName: string): string | null {
    const errors = form.controls[fieldName]?.errors;
    if (!errors) return null;

    const errorMessages: Record<string, string> = {
      required: 'Este campo es requerido',
      email: 'El formato del email es incorrecto',
      passwordNotMatch: 'Las contraseñas no coinciden',
      invalidEmail: 'El correo no es correcto',
      userAlreadyExists: 'Email ya registrado!',
      userNotFound: 'Usuario no encontrado',
      invalidCredentials: 'Credenciales inválidas',
      pattern:
        'La contraseña debe contener al menos 8 caracteres, una mayúscula y un carácter especial.',
      serverError: errors['serverError'] || 'Error de conexión con el servidor',
    };

    for (const key of Object.keys(errors)) {
      if (errorMessages[key]) return errorMessages[key];

      if (key === 'minlength') {
        return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
      }
      if (key === 'maxlength') {
        return `No puede tener más de ${errors['maxlength'].requiredLength} caracteres`;
      }
      if(key === 'min') {
        return `El valor mínimo es ${errors['min'].min}`;
      }
      if(key === 'max') {
        return `El valor máximo es ${errors['max'].max}`;
      }
      if (key === 'nullValidator') {
        return 'Este campo no puede estar vacio';
      }
    }

    return 'Campo inválido';
  }

  hasAnyServerErrors(form: FormGroup): boolean {
    return Object.keys(form.controls).some(
      (controlName) => form.get(controlName)?.errors?.['serverError']
    );
  }

  getAllServerErrorMessages(form: FormGroup): string[] {
    return Object.keys(form.controls)
      .map((controlName) => form.get(controlName)?.errors?.['serverError'])
      .filter((error) => error) as string[];
  }
}
