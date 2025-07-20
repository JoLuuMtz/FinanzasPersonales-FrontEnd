import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import 'animate.css';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { PassWordMatchValidator } from '../../validators/password-match.validator';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmailValidator } from '../../validators/email.validator';
import { AuthService } from '../../services/auth.service';
import { RegisterDTO } from '../../interfaces/register.interface';
import { UserAlreadyExistValidator } from '../../validators/user-already-exist.validator';
import sweetalert2 from 'sweetalert2';

@Component({
  selector: 'app-register-page',
  imports: [RouterModule, FooterComponent, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styles: [
    /* Oculta los spinners en Chrome, Safari y Edge */
    `
      .no-spinner::-webkit-outer-spin-button,
      .no-spinner::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Oculta los spinners en Firefox */
      .no-spinner {
        -moz-appearance: textfield;
      }
    `,
  ],
})
export default class RegisterPageComponent {
  //Formulario Registro
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userValidator = inject(UserAlreadyExistValidator);
  private readonly swal = sweetalert2;

  public fb: FormBuilder = new FormBuilder();
  public isLoading = signal<boolean>(false);
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmailValidator } from '../../validators/email.validator';
import { AuthService } from '../../services/auth.service';
import { RegisterDTO } from '../../interfaces/register.interface';
import { UserAlreadyExistValidator } from '../../validators/user-already-exist.validator';
import sweetalert2 from 'sweetalert2';

@Component({
  selector: 'app-register-page',
  imports: [RouterModule, FooterComponent, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styles: [
    /* Oculta los spinners en Chrome, Safari y Edge */
    `
      .no-spinner::-webkit-outer-spin-button,
      .no-spinner::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Oculta los spinners en Firefox */
      .no-spinner {
        -moz-appearance: textfield;
      }
    `,
  ],
})
export default class RegisterPageComponent {
  //Formulario Registro
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly swal = sweetalert2;

  public fb: FormBuilder = new FormBuilder();
  // public isLoading = signal<boolean>(false);

  public registerForm: FormGroup = this.fb.group(
    {
      dni: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
        ],
        [], //async
      ],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)], []],
      phone: ['', [Validators.required, Validators.minLength(6)]],
      email: [
        '',
        [Validators.required, EmailValidator()],
        [UserAlreadyExistValidator.createValidator(this.userValidator)] // validaciones asincronas
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    },
    {
      validators: [PassWordMatchValidator('password', 'confirmPassword')], // valida las dos passwords a nivel general
    }
  );

  public showAnimation = signal<boolean>(false);

  //todo: Optimizar porque repito codigo en login-page.component.ts
  ngAfterViewInit() {
    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      this.showAnimation.set(true);
    }, 10);

    console.log('LoginPageComponent initialized');
  }

  //todo: Implementar el servicio de registro
  Submit(): void {
    if (this.registerForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      this.registerForm.markAllAsTouched();
      return;
    }

    // Extraer confirmPassword y crear el objeto de registro
    const { confirmPassword, ...registerData } = this.registerForm.value;
    const registerDTO: RegisterDTO = registerData;

    // Mostrar loading
    // this.isLoading.set(true);

    // Llamar al servicio de registro
    this.authService.register(registerDTO).subscribe({
      next: (response) => {
        // this.isLoading.set(false);
        console.log('Registro exitoso:', response);

        this.swal
          .fire({
            title: 'Registro exitoso',
            text: response.message || 'Tu cuenta ha sido creada correctamente.',
            icon: 'success',
            confirmButtonText: 'Ir al login',
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/auth/login']);
            }
          });

        this.registerForm.reset();
      },
      error: (error) => {
        // this.isLoading.set(false);
        console.error('Error en registro:', error);

        this.swal.fire({
          title: 'Error en el registro',
          text: error.message || 'Ha ocurrido un error inesperado',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
        });
      },
    });
  }

  /**
   * Verifica si un campo del formulario es inválido y ha sido tocado
   * @param fieldName - Nombre del campo a validar
   * @returns true si el campo es inválido y ha sido tocado
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  formError(field: string): string | null {
    if (!this.registerForm.controls[field]) return null;

    const errors = this.registerForm.controls[field].errors;
    if (!errors) return null;

    // Obtener la primera clave del objeto de errores
    // const firstErrorKey = Object.keys(errors)[0];
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres`;

        case 'maxlength':
          return `No puede tener más de ${errors['maxlength'].requiredLength} caracteres`;

        case 'email':
          return 'El formato del email es incorrecto';

        case 'passwordNotMatch':
          return 'Las contraseñas no coinciden';

        case 'invalidEmail':
          return 'El correo no es correcto';

        case 'pattern':
          return 'La contraseña debe contener al menos 8 caracteres, una mayúscula y un carácter especial.';
      }
    }

    // validar el campo confirmPassword

    return null;
  }

 
}
