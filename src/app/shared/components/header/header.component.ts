import { Component, inject, Input, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'header-component',
  imports: [RouterModule],
  templateUrl: './header.component.html',
styles:[]
})
export class HeaderComponent {
  private readonly router: Router = inject(Router);
  private readonly _authService = inject(AuthService);

  //TODO: Implement user authentication and profile management

  OnGoToProfile(): void {
    // Navigate to the user profile page
    this.router.navigate(['/dashboard/welcome']);
  }

  @Input()
  public userName: string   = ''; // Default value, can be overridden

  onLogOut(): void {
    this._authService.logOut();
    this.router.navigate(['/auth/login']);
  }
}
