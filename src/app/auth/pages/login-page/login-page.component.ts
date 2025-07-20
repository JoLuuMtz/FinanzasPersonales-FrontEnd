import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import 'animate.css';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, RouterModule, FooterComponent],

  templateUrl: './login-page.component.html',
})
export default class LoginPageComponent implements AfterViewInit {
  // animacion= si
  public mostrarAnimacion = signal<boolean>(false);

  private readonly _authService: AuthService = inject(AuthService);

  constructor() {
    this._authService;
  }

  private readonly Router: Router = inject(Router);

  showPassword: boolean = false;

  ngAfterViewInit() {
    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      this.mostrarAnimacion.set(true);
    }, 10);

    console.log('LoginPageComponent initialized');
  }

  onLogin() {}

  onGoRegister() {
    this.Router.navigate(['/auth/register']);
  }
  Hold() {
    this.showPassword = !this.showPassword;
  }
}
