import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import 'animate.css';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register-page',
  imports: [RouterModule, FooterComponent],
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

  public fb: FormBuilder = new FormBuilder();

  public registerForm: FormGroup = this.fb.group({
    dni: [
      0,
      [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
    ],
    name: ['', [Validators.required]],
    lastName: ['', [Validators.required], []],
    phone: [0, []],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
      [],
    ],
    password: [''],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

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
    if (!this.registerForm.valid) {
      return;
    }
  }

  //todo: Implementa validaciones basicas del formulario
  // formError(field: string): string | null {
  // if( ! this.MyFormBassic.controls[field]) return null;
  // const error = this.MyFormBassic.controls[field].errors ||  //
  //     {}

  // }
}
