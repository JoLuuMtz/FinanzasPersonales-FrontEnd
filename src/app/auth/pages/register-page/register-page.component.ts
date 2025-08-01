import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmailValidator } from '../../validators/email.validator';
import { AuthService } from '../../services/auth.service';
import { RegisterDTO } from '../../interfaces/register.interface';
import { UserAlreadyExistService } from '../../validators/user-already-exist.service';
import sweetalert2 from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { Component, inject, signal } from '@angular/core';
import { PassWordMatchValidator } from '../../validators/password-match.validator';

@Component({
  selector: 'app-register-page',
  imports: [RouterModule, FooterComponent, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
  styles: [],
})
export default class RegisterPageComponent {
  //Formulario Registro
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly swal = sweetalert2;
  private readonly UserAlreadyExistService = inject(UserAlreadyExistService);

  private fb: FormBuilder = new FormBuilder();
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
        [Validators.required, EmailValidator()], // validador sincrono
        [this.UserAlreadyExistService.validate.bind(UserAlreadyExistService)], // Validaor asyncronong
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
  userAlreadyExistService: any;

  constructor() {
    const error = this.registerForm.getError('email');

    console.log(error);
  }

  //todo: Optimizar porque repito codigo en login-page.component.ts
  ngAfterViewInit() {
    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      this.showAnimation.set(true);
    }, 10);

    console.log('LoginPageComponent initialized');

    const error = this.registerForm.getError('email');

    console.log('error del form ->> ', error);
  }

  //todo: Implementar el servicio de registro
  Submit(): void {
    if (this.registerForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      this.registerForm.markAllAsTouched();

      // Verificar si hay errores de servidor usando el método centralizado
      if (this.authService.hasServerErrors(this.registerForm, 'email')) {
        const errorMessage = this.authService.getServerErrorMessage(
          this.registerForm,
          'email'
        );
        this.swal.fire({
          title: 'Error de conexión',
          text: errorMessage || 'Error de conexión',
          icon: 'error',
          confirmButtonText: 'Reintentar',
        });
        return;
      }

      return;
    }

    // Verificar una vez más si hay errores de servidor antes de enviar
    if (this.authService.hasServerErrors(this.registerForm, 'email')) {
      const errorMessage = this.authService.getServerErrorMessage(
        this.registerForm,
        'email'
      );
      this.swal.fire({
        title: 'Error de conexión',
        text: errorMessage || 'Error de conexión',
        icon: 'warning',
        confirmButtonText: 'Verificar conexión',
      });
      return;
    }

    // Extraer confirmPassword y crear el objeto de registro
    const { confirmPassword, ...registerData } = this.registerForm.value;
    const registerDTO: RegisterDTO = registerData;

    // Llamar al servicio de registro
    this.authService.register(registerDTO).subscribe({
      next: (response) => {
      

        this.swal
          .fire({
            title: 'Registro exitoso',
            text: 'Tu cuenta ha sido creada correctamente.',
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
   * Verifica si hay errores de servidor en el formulario (usa servicio centralizado)
   * @returns true si hay errores de servidor
   */
  hasServerErrors(): boolean {
    return this.authService.hasServerErrors(this.registerForm, 'email');
  }

  /**
   * Obtiene el mensaje de error del servidor si existe (usa servicio centralizado)
   * @returns string con el mensaje de error o null
   */
  getServerErrorMessage(): string | null {
    return this.authService.getServerErrorMessage(this.registerForm, 'email');
  }

  /**
   * Verifica si un campo del formulario es inválido y ha sido tocado (usa servicio centralizado)
   * @param fieldName - Nombre del campo a validar
   * @returns true si el campo es inválido y ha sido tocado
   */
  isFieldInvalid(fieldName: string): boolean {
    return this.authService.isFieldInvalid(this.registerForm, fieldName);
  }

  /**
   * Obtiene el mensaje de error para un campo específico (usa servicio centralizado)
   * @param field - Nombre del campo
   * @returns string con el mensaje de error o null
   */
  formError(field: string): string | null {
    return this.authService.getFieldError(this.registerForm, field);
  }
}
