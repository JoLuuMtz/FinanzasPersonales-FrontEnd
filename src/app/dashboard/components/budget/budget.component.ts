import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { UserBudget } from '../../../auth/interfaces/user.interfaces';
import { DialogFormComponent } from '../dialog-form/dialog-form.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormValidService } from '../../../shared/services/form-valid.service';

@Component({
  selector: 'budget-component',
  imports: [CurrencyPipe, CommonModule, DialogFormComponent, ReactiveFormsModule],
  templateUrl: './budget.component.html',
})
export class BudgetComponent {
  private readonly userService = inject(UserService);
  private readonly validFormServices = inject(FormValidService);
  private readonly fb = inject(FormBuilder);

  public budgetForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(20)]],
    descripcion: [
      '',
      [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(10),
      ],
    ],
  });

  //? propiedades del formDialog Budget
  isVisible: boolean = false;

  //
  public budgets: UserBudget[] = this.userService.User().userBudgets;

  constructor() {}

  //TODO: IMPLEMENTAR EL SERVICIO DE BORRADO DE PRESUPUESTOS
  deleteBudget(id: number): void {
    console.log('deleteBudget', id);
  }

  //TODO: iMPLEMENTAR EL SERVICIO DE AREGAR NUEVO PRESPUESTO Y  PONERLO EN LA LISTA
  addNewBudget(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    
    if (!this.budgetForm.valid) {
      // Marcar todos los campos como touched para mostrar errores
      this.budgetForm.markAllAsTouched();
      return;
    }
    console.log("valores => ", this.budgetForm.value);
    this.closeDialog();
  }

  // verifica sie es valido o ha sido tocado el campo
  isValidField(field: string): boolean {
    return this.validFormServices.isFieldInvalid(this.budgetForm, field);
  }

  //muestra los mensajes de error del campo especifico
  getErrorField(field: string): string | null {
    return this.validFormServices.getFieldError(this.budgetForm, field);
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
