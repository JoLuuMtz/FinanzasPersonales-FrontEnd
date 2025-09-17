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
import { FormValidService } from '../../../shared/services/form-valid.service';
import { IncomeDTO, IncomeUpdateDTO } from '../../interfaces/Incomes.interface';
import Swal from 'sweetalert2';

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
  //? Propiedades el componente
  public isVisible: boolean = false;
  private readonly _incomesService: IncomesService = inject(IncomesService);
  private readonly _userService = inject(UserService);
  private readonly _formValidService = inject(FormValidService);
  private readonly sw = Swal;
  public incomeType = signal<TypeIncome[]>([]);

  public incomes = computed(() => this._userService.User()?.userIncomes || []); //? data del usuario

  //? Form para agregar Un Ingreso
  private readonly fb: FormBuilder = inject(FormBuilder);
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
    amount: [0, [Validators.required, Validators.min(10)]],
    date: [
      null as Date | string | null,
      [Validators.required, Validators.nullValidator],
    ], // acepta tipo Date o string para inputs HTML
    typeIncome: [0, [Validators.required, Validators.nullValidator]],
  });

  //? Convertir Date a string YYYY-MM-DD para el input
  formatDate(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  //? Propiedad para indicar si está cargando los tipos de ingreso
  public loadingTypes = signal<boolean>(true);

  //? Propiedades para controlar si estamos editando o agregando
  public isEditMode: boolean = false; // si es update true si es add false
  public currentEditingId: number | null = null; // id del ingreso que se esta editando

  ngOnInit(): void {
    //? Obtencion de la data del TypeIncome
    this._incomesService.getIncomeType().subscribe({
      next: (types) => {
        if (types) {
          this.incomeType.set(types);
        }
        this.loadingTypes.set(false); // Finaliza carga
      },
      error: () => {
        this.loadingTypes.set(false); // También marcar como finalizado en caso de error
        // Mostrar mensaje de error si es necesario
      },
    });
    //? Obtencion de la data del usuario
  }

  //? Manejo del form-Component y propiedades
  totalIncomes(): number | undefined {
    const user = this._userService.User(); //? data del usuario
    return user.userIncomes?.reduce(
      (total, income) => total + income.amount,
      0
    );
  }
  public toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    // Si se está abriendo el diálogo, asegurar que esté en modo agregar
    if (this.isVisible) {
      this.setAddMode();
    }
  }

  openDialog() {
    this.isVisible = true;
  }

  closeDialog() {
    this.isVisible = false;
    // Resetear el modo de edición al cerrar
    this.isEditMode = false;
    this.currentEditingId = null;
  }

  //? metodo para resetear el form y el modo de edicion
  private setAddMode(): void {
    this.isEditMode = false;
    this.currentEditingId = null;
    this.IncomeForm.reset();
  }


  /**
   * Verifica si un campo es inválido (usa servicio centralizado)
   */
  isFieldInvalid(fieldName: string): boolean {
    return this._formValidService.isFieldInvalid(this.IncomeForm, fieldName);
  }

  /**
   * Obtiene el mensaje de error de un campo (usa servicio centralizado)
   */
  getFieldError(fieldName: string): string | null {
    return this._formValidService.getFieldError(this.IncomeForm, fieldName);
  }


  // Agrega un nuevo Income
  OnSubmit(): void {
    if (!this.IncomeForm.valid) {
      return;
    }

    if (this.isEditMode) {
      this.executeUpdate();
    } else {
      this.addNewIncome();
    }
  }

  //? metodo para agregar un nuevo Income
  private addNewIncome(): void {
    const formValue = this.IncomeForm.value;
    //Mapea el formValue para que coincida con el IncomeDTO
    const incomeDTO: IncomeDTO = {
      name: formValue.name!,
      description: formValue.description!,
      amount: formValue.amount!,
      date: new Date(formValue.date!), // Asegurar que sea un objeto Date válido
      idTypeIncomes: formValue.typeIncome!,
    };

    console.log('DTO a enviar:', incomeDTO);

    this._incomesService.addNewIncome(incomeDTO).subscribe({
      next: (income) => {
        if (income) {
          console.info('Ingreso agregado exitosamente:', income);
          // Mostrar alerta de éxito con SweetAlert
          this.sw.fire({
            title: '¡Éxito!',
            text: 'El ingreso se ha agregado correctamente',
            icon: 'success',
            confirmButtonText: 'OK',
          });

          this.resetAndCloseForm();
        }
      },
      error: (error) => console.warn('Error al agregar ingreso:', error),
    });
  }

  //? metodo para eliminar un Income
  OnDeteleid(id: number) {
    this._incomesService.deleteIncomeByID(id).subscribe({
      next: (result) => {
        if (result) {
          console.info('Ingreso eliminado exitosamente');
          // Mostrar alerta de éxito con SweetAlert
          this.sw.fire({
            title: '¡Éxito!',
            text: 'El ingreso se ha eliminado correctamente',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.closeDialog();
          this.IncomeForm.reset();
        }
      },
      error: (error) => console.warn('Error al eliminar ingreso:', error),
    });
  }

  //? metodo para editar un Income
  OnEditIncomeById(id: number) {
    console.log('Editar ingreso con ID:', id);

    // Buscar el ingreso por ID y cargar sus datos en el formulario
    const incomeToEdit = this.incomes().find(
      (income) => income.idIncome === id
    );

    if (!incomeToEdit) {
      console.error('No hay Ingresos con ese Id', id);
      this.sw.fire({
        title: 'Error',
        text: 'No se encontró el ingreso a editar',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    // Establecer modo de edición y configurar el formulario
    this.setupEditMode(id, incomeToEdit);
    this.openDialog();
  }

  private setupEditMode(id: number, incomeToEdit: any): void {
    // Establecer modo de edición
    this.isEditMode = true;
    this.currentEditingId = id;

    // Convertir la fecha al formato correcto para el input date (YYYY-MM-DD)
    const dateForInput = this.formatDate(new Date(incomeToEdit.date));

    // Cargar datos en el formulario
    this.IncomeForm.patchValue({
      name: incomeToEdit.name,
      description: incomeToEdit.description,
      amount: incomeToEdit.amount,
      date: dateForInput,
      typeIncome: incomeToEdit.typeIncome.idTypeIncomes,
    });

    console.log('Formulario cargado para edición:', this.IncomeForm.value);
  }

  /* metodo que se ejecuta si el dialog es para editar */
  private executeUpdate(): void {
    if (!this.currentEditingId || !this.IncomeForm.valid) {
      console.error('Formulario inválido o ID faltante para actualizar');
      return;
    }

    const formValue = this.IncomeForm.value;
    const incomeUpdateDTO: IncomeUpdateDTO = {
      name: formValue.name!,
      description: formValue.description!,
      amount: formValue.amount!,
      date: new Date(formValue.date!),
    };

    console.log('Actualizando ingreso:', incomeUpdateDTO);

    this._incomesService.UpdateIncome(this.currentEditingId, incomeUpdateDTO).subscribe({
      next: (income: IncomeDTO | null) => {
        if (income) {
          console.info('Ingreso actualizado exitosamente:', income);
          this.sw.fire({
            title: '¡Éxito!',
            text: 'El ingreso se ha actualizado correctamente',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.resetAndCloseForm();
        }
      },
      error: (error: any) => {
        console.warn('Error al actualizar ingreso:', error);
        this.sw.fire({
          title: 'Error',
          text: 'No se pudo actualizar el ingreso. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      },
    });
  }

  private resetAndCloseForm(): void {
    this.closeDialog();
    this.IncomeForm.reset();
    this.isEditMode = false;
    this.currentEditingId = null;
    console.log('Formulario reseteado y diálogo cerrado');
  }
}
