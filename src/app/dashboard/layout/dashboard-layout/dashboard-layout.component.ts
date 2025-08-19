import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SideBarComponent } from '../../../shared/components/side-bar/side-bar.component';
import { UserData } from '../../../auth/interfaces/user.interfaces';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterModule, HeaderComponent, SideBarComponent],
  templateUrl: './dashboard-layout.component.html',
  styles: [],
})
export class DashboardLayoutComponent implements OnInit {
  private readonly authService = inject(AuthService);

  // Computed properties que se actualizan automáticamente
  public currentUser = computed(() => this.authService.getCurrentUser());
  public isAuthenticated = computed(() => this.authService.IsAutenticated());
  public userName = computed(() => this.currentUser()?.name  || '');

  ngOnInit(): void {
    
  }
}
