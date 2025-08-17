import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'nav-list',
  imports: [],
  templateUrl: './nav-list.component.html',
  styleUrl: './nav-list.component.css',
})
export class NavListComponent {
  @Output() showDialog = new EventEmitter<void>();

  onAddClick() {
    this.showDialog.emit();
  }
}
