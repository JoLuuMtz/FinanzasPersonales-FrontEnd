import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dialog-form',
  imports: [CommonModule],
  templateUrl: './dialog-form.component.html',
  styleUrl: './dialog-form.component.css',
})
export class DialogFormComponent {
  
  @Input() isVisible: boolean = false;
  @Input() title: string = '';
  @Input() width: string = '500px';
  @Input() height: string = 'auto';
  @Input() showCloseButton: boolean = true;

  @Output() closeDialog = new EventEmitter<void>();

  isClosing = false;

  onClose(): void {
    this.isClosing = true;
    setTimeout(() => {
      this.closeDialog.emit();
      this.isClosing = false;
    }, 300); // Tiempo de la animación de salida
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
