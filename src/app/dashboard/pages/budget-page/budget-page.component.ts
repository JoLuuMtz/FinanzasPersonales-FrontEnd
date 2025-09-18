import { Component, computed, inject } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';
import { BudgetComponent } from '../../components/budget/budget.component';
import { UserService } from '../../../user/services/user.service';
import { HistoryTableComponent } from '../../components/history-table/history-table.component';
import { BudgetList } from '../../../auth/interfaces/user.interfaces';

@Component({
  selector: 'app-budget-page',
  imports: [TitleComponent, BudgetComponent, HistoryTableComponent],
  templateUrl: './budget-page.component.html',
  styleUrl: './budget-page.component.css',
})
export class BudgetPageComponent {
  private readonly _userService = inject(UserService);
  public budgetsList = computed(() => {
    const user = this._userService.User();
    return user?.userBudgets?.flatMap((budget) => budget.budgetLists) || [];
  });

  constructor() {
    console.log('BudgetsList:', this.budgetsList());
  }

  OnEditIncomeById(id: number): void {
    console.log(id);
  }

  OnDeteleid(id: number): void {
    console.log(id);
  }

  showTable() {}
}
