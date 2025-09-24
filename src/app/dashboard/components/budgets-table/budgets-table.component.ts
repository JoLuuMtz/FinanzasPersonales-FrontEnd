import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'budgets-table-history',
  imports: [TitleCasePipe, DatePipe, CurrencyPipe],
  templateUrl: './budgets-table.component.html'
})
export class BudgetsTableComponent {

  @Input() Data: any = []; //? para mostrar los datos de la tabla
  @Output() delete = new EventEmitter<number>(); //?Emite el id del ingreso a eliminar
  @Output() edit = new EventEmitter<number>(); //?emite el id del ingreso a editar

  // @Input() showDialog: boolean = false; //? para mostrar el dialogo de agregar ingreso

  onDeleteClick(id: number) {
    this.delete.emit(id);
  }
  onEditClick(id: number) {
    this.edit.emit(id);
  }
}
