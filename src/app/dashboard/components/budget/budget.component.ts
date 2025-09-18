import { BudgetService } from './../../services/budget.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { UserService } from '../../../user/services/user.service';
import { DialogFormComponent } from '../dialog-form/dialog-form.component';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormValidService } from '../../../shared/services/form-valid.service';
import { CreateBudgetDTO } from '../../interfaces/budget.interface';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'budget-component',
  imports: [
    CurrencyPipe,
    CommonModule,
    DialogFormComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './budget.component.html',
})
export class BudgetComponent {

  private readonly _userService = inject(UserService);
  private readonly validFormServices = inject(FormValidService);
  private readonly _budgetService = inject(BudgetService);
  private readonly fb = inject(FormBuilder);
  private readonly _sw = Swal;

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

  public budgets = computed(() => this._userService.User()?.userBudgets || []); //? data del usuario

  constructor() { }

  //TODO: iMPLEMENTAR EL SERVICIO DE AREGAR NUEVO PRESPUESTO Y  PONERLO EN LA LISTA

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

  // ? CRUD OPERATIONS

  addNewBudget(): void {

    const formValue = this.budgetForm.value;

    // Se mapea la data 
    const newBudget: CreateBudgetDTO = {
      name: formValue.name!,
      description: formValue.descripcion!
    };

    // Mostrar loading mientras se crea
    this._sw.fire({
      title: 'Creando presupuesto...',
      allowOutsideClick: false,
      didOpen: () => {
        this._sw.showLoading();
      },
    });

    this._budgetService
      .addNewBudget(newBudget)
      .pipe(finalize(() => this._sw.close()))// cuando finalice la operacion cierra el loading
      .subscribe({
      next: (budget) => {
        console.log('Nuevo presupuesto agregado:', budget);
        if (budget) {
          this._sw.fire({
            title: '¡Éxito!',
            text: 'El presupuesto se ha creado correctamente',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.budgetForm.reset();
        }
      },
      error: (error) => {
        this._sw.fire({
          title: 'Error',
          text: 'No se pudo crear el presupuesto. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        console.error('Error al agregar el presupuesto:', error);
      },
    });

    this.closeDialog();
  }

  deleteBudget(id: number): void {

    console.log(id);
    const budgetToDelete = this.budgets().find(
      (budget) => budget.idBudget === id
    );
    const budgetName = budgetToDelete
      ? budgetToDelete.name
      : 'este presupuesto';

    this._sw
      .fire({
        title: `¿Eliminar prespuesto: ${budgetName}`,
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
      })
      .then((result) => {
        if (result.isConfirmed) {
          // Mostrar loading mientras se elimina
          this._sw.fire({
            title: 'Eliminando presupuesto...',
            allowOutsideClick: false,
            didOpen: () => {
              this._sw.showLoading();
            },
          });

          this._budgetService
            .deleteBudget(id)
            .pipe(finalize(() => this._sw.close()))
            .subscribe({
            next: (result) => {
              if (result) {
                this._sw.fire({
                  title: '¡Éxito!',
                  text: 'El presupuesto se ha eliminado correctamente',
                  icon: 'success',
                  confirmButtonText: 'OK',
                });
              }
            },
            error: (error) => {
              this._sw.fire({
                title: 'Error',
                text: 'No se pudo eliminar el presupuesto. Intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'OK',
              });
              console.error('Error al eliminar presupuesto:', error);
            },
          });
        }
      });
  }
}
