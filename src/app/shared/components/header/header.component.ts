import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'header-component',
  imports: [RouterModule],
  templateUrl: './header.component.html',
styles:[]
})
export class HeaderComponent {
  private readonly router: Router = inject(Router);

  //TODO: Implement user authentication and profile management

  OnGoToProfile(): void {
    // Navigate to the user profile page
    this.router.navigate(['/dashboard/welcome']);
  }
}
