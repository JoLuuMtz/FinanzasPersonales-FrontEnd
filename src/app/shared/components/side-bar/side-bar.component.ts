import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'side-bar',
  imports: [RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
})
export class SideBarComponent {
  //todo: implementar detales rutas de la barra lateral y el responsive

  public menuItems = [

    {
      name: 'Presupuesto',
      icon: 'assets/icons/budget-icon.png',
      route: '/dashboard/budget',
    },
    {
      name: 'Ingresos',
      icon: 'assets/icons/incomes-icon.png',
      route: '/dashboard/incomes',
    },
    {
      name: 'Gastos',
      icon: 'assets/icons/spends-icon.png',
      route: '/dashboard/spends',
    },
    {
      name: 'Reportes',
      icon: 'assets/icons/report-icon.png',
      route: '/dashboard/reports',
    },
    // {
    //   name: 'Configuración',
    //   icon: 'assets/icons/setting-icon.png',
    //   route: '/dashboard/settings',

    // },
  ];
}
