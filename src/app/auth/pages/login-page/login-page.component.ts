import { EmailValidator } from './../../validators/email.validator';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import 'animate.css';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginDTO } from '../../interfaces/login-response.interfaces';
import sweetalert2 from 'sweetalert2';
import { FormValidService } from '../../../shared/services/form-valid.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, RouterModule, FooterComponent, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export default class LoginPageComponent implements AfterViewInit {
  // Servicios y dependencias
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly swal = sweetalert2;
  private readonly formValidService = inject(FormValidService);

  // Propiedades del componente
  public mostrarAnimacion = signal<boolean>(false);
  public showPassword = signal<boolean>(false);
  public isLoading = signal<boolean>(false);

  private fb: FormBuilder = new FormBuilder();

  public loginForm: FormGroup = this.fb.group({
    email: ['prueba@example.com', [Validators.required, EmailValidator()]],
    password: [
      'Prueba12345*',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/),
      ],
    ],
  });

  constructor() {}

  // showPassword: boolean = false;

  // animacion de component
  ngAfterViewInit() {
    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      this.mostrarAnimacion.set(true);
    }, 10);

    console.log('LoginPageComponent initialized');
  }

  /**
   * Loggea al usuario
   */
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      // Verificar errores de servidor usando métodos centralizados
      if (this.formValidService.hasAnyServerErrors(this.loginForm)) {
        const serverErrors = this.formValidService.getAllServerErrorMessages(
          this.loginForm
        );
        this.swal.fire({
          title: 'Error de conexión',
          text: serverErrors.join(', '),
          icon: 'error',
          confirmButtonText: 'Reintentar',
        });
        return;
      }

      return;
    }

    this.isLoading.set(true);
    const loginData: LoginDTO = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.swal
          .fire({
            title: 'Login exitoso',
            text: 'Bienvenido!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          })
          .then(() => {
            console.log("Login-component", this.authService.getCurrentUser());
            this.router.navigate(['/dashboard']);
          });
      },
      error: (error) => {
        this.isLoading.set(false);
        this.swal.fire({
          title: 'Error en el login',
          text: error.message || 'Credenciales inválidas',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo',
        });
      },
    });
  }



  /**
   * Alterna la visibilidad de la contraseña
   */
  togglePassword(): void {
    this.showPassword.update((value) => !value);
  }

  /**
   * Verifica si un campo es inválido (usa servicio centralizado)
   */
  isFieldInvalid(fieldName: string): boolean {
    return this.formValidService.isFieldInvalid(this.loginForm, fieldName);
  }

  /**
   * Obtiene el mensaje de error de un campo (usa servicio centralizado)
   */
  getFieldError(fieldName: string): string | null {
    return this.formValidService.getFieldError(this.loginForm, fieldName);
  }


}
