import { Component, computed, inject, OnInit } from '@angular/core';

import { TitleComponent } from '../../components/title/title.component';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { UserService } from '../../../user/services/user.service';

@Component({
  selector: 'app-welcome-page',
  imports: [TitleComponent, ProfileCardComponent],
  templateUrl: './welcome-page.component.html',
})
export class WelcomePageComponent {
  private readonly _userService = inject(UserService);
  public user = computed(() => this._userService.User());

  public name = this.user()?.name.toString();
  public lastname = this.user()?.lastName.toString();
  public email = this.user()?.email.toString();
  public profileImage = this.user()?.profileImagen;
}
