import { Component, inject, OnInit } from '@angular/core';

import { TitleComponent } from '../../components/title/title.component';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';

@Component({
  selector: 'app-welcome-page',
  imports: [TitleComponent, ProfileCardComponent],
  templateUrl: './welcome-page.component.html',
})
export class WelcomePageComponent {



}
