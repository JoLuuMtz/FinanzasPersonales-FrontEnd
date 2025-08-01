import { Component, Input } from '@angular/core';

@Component({
  selector: 'profile-card',
  imports: [],
  templateUrl: './profile-card.component.html',
})
export class ProfileCardComponent {
  @Input() name: string = '';
  @Input() lastname: string = '';
  @Input() email: string = '';
  @Input() profileImage: string = '';

  onImageError() {
    // Si la imagen falla al cargar, resetear a la imagen por defecto
    this.profileImage = '';
  }

  onEditPhoto() {}
}
