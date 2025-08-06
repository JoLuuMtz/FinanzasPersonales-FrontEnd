import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { UserBudget } from '../../../auth/interfaces/user.interfaces';

@Component({
  selector: 'budget-component',
  imports: [CurrencyPipe, CommonModule],
  templateUrl: './budget.component.html',
})
export class BudgetComponent {
  private readonly userService = inject(UserService);

  //
  public budgets: UserBudget[] = this.userService.User.userBudgets;

  constructor() {
    console.log(this.budgets);
  }

  totalBudget(): number {
    



    return 0;

  }

  //TODO: IMPLEMENTAR EL SERVICIO DE BORRADO DE PRESUPUESTOS
  deleteBudget(id: number): void {}

  //TODO: iMPLEMENTAR EL SERVICIO DE AREGAR NUEVO PRESPUESTO Y  PONERLO EN LA LISTA
  addNewBudget() {
    console.log('addNewBudget');
  }
}
