import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { UserBudget } from '../../../auth/interfaces/user.interfaces';
import { DialogFormComponent } from '../dialog-form/dialog-form.component';


@Component({
  selector: 'budget-component',
  imports: [CurrencyPipe, CommonModule, DialogFormComponent],
  templateUrl: './budget.component.html',
})
export class BudgetComponent {
  private readonly userService = inject(UserService);

  //? propiedades del formDialog Budget
  isVisible: boolean = false;

  //
  public budgets: UserBudget[] = this.userService.User().userBudgets;

  constructor() {}

  // totalBudget(): number {

  //   return 0;

  // }

  //TODO: IMPLEMENTAR EL SERVICIO DE BORRADO DE PRESUPUESTOS
  deleteBudget(id: number): void {}

  //TODO: iMPLEMENTAR EL SERVICIO DE AREGAR NUEVO PRESPUESTO Y  PONERLO EN LA LISTA
  addNewBudget() {
    console.log('addNewBudget');
  }

  public toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }
  openDialog() {
    this.isVisible = true;
  }

  closeDialog() {
    this.isVisible = false;
  }
  //
}
