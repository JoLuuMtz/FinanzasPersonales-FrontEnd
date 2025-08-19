import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'nav-list',
  imports: [CurrencyPipe],
  templateUrl: './nav-list.component.html',
})
export class NavListComponent {
  @Output() showDialog = new EventEmitter<void>();
  @Output() deleteIncome = new EventEmitter<number>();
  @Output() editIncome = new EventEmitter<number>();

  @Input() TotalIncome: number | undefined = 0;

  onAddClick() {
    this.showDialog.emit();
  }

}
