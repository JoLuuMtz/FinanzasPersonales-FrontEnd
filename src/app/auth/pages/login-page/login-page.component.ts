import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import 'animate.css';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';


@Component({
  selector: 'app-login-page',
  imports: [CommonModule, RouterModule, FooterComponent],

  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export default class LoginPageComponent  implements AfterViewInit {
  // animacion= si
  public mostrarAnimacion = signal<boolean>(false);

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
