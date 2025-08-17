import { Component, inject, OnInit, signal } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';

import { DialogFormComponent } from '../../../shared/components/dialog-form/dialog-form.component';
import { TypeIncome, UserData } from '../../../auth/interfaces/user.interfaces';
import { IncomesService } from '../../services/incomes.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
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
    NavListComponent
  ],
  templateUrl: './incomes-page.component.html',
  styleUrl: './incomes-page.component.css',
})
export class IncomesPageComponent implements OnInit {
  public isVisible: boolean = false;
  private readonly _incomesService: IncomesService = inject(IncomesService);
  private readonly _userService = inject(UserService);
  public incomeType = signal<TypeIncome[]>([]);
public user:UserData[] = [];

  private readonly fb: FormBuilder = inject(FormBuilder);

  //? Form para agregar Un Ingreso
  public IncomeForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    amount: [0, [Validators.required]],
    date: [, []],
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

  //? Manejo del form-compoennt y propiedades

  public toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }
  openDialog() {
    this.isVisible = true;
  }

  closeDialog() {
    this.isVisible = false;
  }

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
}
