import { Component } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';
import { BudgetComponent } from '../../components/budget/budget.component';

@Component({
  selector: 'app-budget-page',
  imports: [TitleComponent, BudgetComponent],
  templateUrl: './budget-page.component.html',
  styleUrl: './budget-page.component.css',
})
export class BudgetPageComponent {}
