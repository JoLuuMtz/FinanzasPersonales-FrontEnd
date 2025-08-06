import { Component } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';
import { SpendIncomeFormComponent } from '../../components/spend-income-form/spend-income-form.component';

@Component({
  selector: 'app-incomes-page',
  imports: [TitleComponent, SpendIncomeFormComponent],
  templateUrl: './incomes-page.component.html',
  styleUrl: './incomes-page.component.css',
})
export class IncomesPageComponent {


  public isVisible: boolean = false;

  public toggleVisibility(): void {
    this.isVisible = !this.isVisible;


    // console.log('Visibility toggled:', this.isVisible);
  }



}
