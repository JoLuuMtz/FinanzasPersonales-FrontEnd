import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TitleComponent } from '../../components/title/title.component';
import { DialogFormComponent } from '../../components/dialog-form/dialog-form.component';
import {
  TypeIncome,
  UserData,
  UserIncome,
} from '../../../auth/interfaces/user.interfaces';
import { IncomesService } from '../../services/incomes.service';
import { HistoryTableComponent } from '../../components/history-table/history-table.component';
import { UserService } from '../../../user/services/user.service';
import { NavListComponent } from '../../components/nav-list/nav-list.component';

@Component({
  selector: 'app-incomes-page',
  imports: [
    TitleComponent,
    DialogFormComponent,
    ReactiveFormsModule,
    TitleCasePipe,
    HistoryTableComponent,
    NavListComponent,
  ],
  templateUrl: './incomes-page.component.html',
  styleUrl: './incomes-page.component.css',
})
export class IncomesPageComponent implements OnInit {
  public isVisible: boolean = false;
  private readonly _incomesService: IncomesService = inject(IncomesService);
  private readonly _userService = inject(UserService);
  public incomeType = signal<TypeIncome[]>([]);
  // public incomes = signal<UserIncome[]>(this._userService.User.userIncomes); //? data del usuario
  public incomes = computed(() => this._userService.User().userIncomes);

  private readonly fb: FormBuilder = inject(FormBuilder);

  //? Form para agregar Un Ingreso
  public IncomeForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(20)]],
    description: [
      '',
      [
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(20),
      ],
    ],
    amount: [0, [Validators.required, Validators.min(500)]],
    date: [null as Date | null, []], // acepta tipo Date
    typeIncome: [0, [Validators.required]],
  });

  // Convertir Date a string YYYY-MM-DD para el input
  formatDate(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  ngOnInit(): void {
    //? Obtencion de la data del TypeIncome
    this._incomesService.getIncomeType().subscribe({
      next: (data) => {
        if (data) {
          this.incomeType.set(data);
        }
      },
      error: (err) => {
        console.error('Error al obtener los tipos de ingresos:', err);
      },
    });
    //? Obtencion de la data del usuario
  }

  //? Propiedades el componente}

  //? Formularios del Component
  //TODO: Implementar Formulario de creacion de Ingresos

  //? Manejo del form-Component y propiedades
  totalIncomes(): number | undefined {
    const user = this._userService.User() as UserData; //? data del usuario
    return user.userIncomes?.reduce(
      (total, income) => total + income.amount,
      0
    );
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

  //TODO: Implementar de agregar Ingresos

  OnSubmit(): void {
    if (!this.IncomeForm.value) {
      return;
    }

    console.log('Formulario enviado:', this.IncomeForm.value);
    console.log('Tipo de ingreso seleccionado:', this.IncomeForm.value.date);
    console.log(typeof this.IncomeForm.value.date);

    // this._incomesService.createIncome(this.IncomeForm.value).subscribe({
    //   next: (data) => {
    //     console.log('Ingreso creado exitosamente:', data);
    //     this.closeDialog();
    //     this.IncomeForm.reset();
    //   },
    //   error: (err) => {
    //     console.error('Error al crear el ingreso:', err);
    //   },
    // });
  }

  //TODO: Implementar metodo de eliminacion de Ingresos
  OnDeteleid(id: number) {
    console.log('Eliminar ingreso con ID:', id);
  }

  //TODO: Implementar metodos de edicion de Ingresos
  OnEditIncomeById(id: number) {
    console.log('Editar ingreso con ID:', id);
    //? Buscar el ingreso por ID y cargar sus datos en el formulario
    const incomeToEdit = this.incomes().find(
      (income) => income.idIncome === id
    );
    if (!incomeToEdit) {
      console.error('No hay Ingresos con ese Id', id);
      return;
    }
    this.IncomeForm.patchValue({
      name: incomeToEdit.name,
      description: incomeToEdit.description,
      amount: incomeToEdit.amount,
      date: new Date(), // Establece la fecha de hoy
      typeIncome: incomeToEdit.typeIncome.idTypeIncomes,
    });
    this.openDialog();
  }
}
