import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SideBarComponent } from '../../../shared/components/side-bar/side-bar.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterModule, HeaderComponent, SideBarComponent],
  templateUrl: './dashboard-layout.component.html',
  styles: [],
})
export class DashboardLayoutComponent {}
