import { Component, inject, OnInit, signal } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';

import { DialogFormComponent } from '../../../shared/components/dialog-form/dialog-form.component';
import { TypeIncome } from '../../../auth/interfaces/user.interfaces';
import { IncomesService } from '../../services/incomes.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-incomes-page',
  imports: [TitleComponent, DialogFormComponent],
  templateUrl: './incomes-page.component.html',
  styleUrl: './incomes-page.component.css',
})
export class IncomesPageComponent implements OnInit {
  public isVisible: boolean = false;
  private readonly _incomesService: IncomesService = inject(IncomesService);
  public incomeType = signal<TypeIncome[]>([]);

  private readonly fb: FormBuilder = inject(FormBuilder);

  public IncomeForm = this.fb.group({
    name: ['', []],
    description: ['', []],
    amount: [0, []],
    date: [this.formatDate(new Date()), []],
  });

  // Convertir Date a string YYYY-MM-DD para el input
  formatDate(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  ngOnInit(): void {
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
}
