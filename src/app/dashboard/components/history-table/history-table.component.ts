import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'history-table',
  imports: [TitleCasePipe, DatePipe, CurrencyPipe],
  templateUrl: './history-table.component.html',
  styleUrl: './history-table.component.css',
})
export class HistoryTableComponent {
  @Input() Data: any[] = []; //? para mostrar los datos de la tabla
  @Output() deleteIncome = new EventEmitter<number>(); //?Emite el id del ingreso a eliminar
  @Output() editIncome = new EventEmitter<number>(); //?emite el id del ingreso a editar

  // @Input() showDialog: boolean = false; //? para mostrar el dialogo de agregar ingreso

  onDeleteClick(id: number) {
    this.deleteIncome.emit(id);
  }
  onEditClick(id: number) {
    this.editIncome.emit(id);
  }
}


