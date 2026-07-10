import { Component, computed, inject, signal } from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';
import { BudgetComponent } from '../../components/budget/budget.component';
import { UserService } from '../../../user/services/user.service';
import { HistoryTableComponent } from '../../components/history-table/history-table.component';
import { BudgetList } from '../../../auth/interfaces/user.interfaces';
import { DialogFormComponent } from '../../components/dialog-form/dialog-form.component';
import { BudgetsTableComponent } from '../../components/budgets-table/budgets-table.component';

@Component({
  selector: 'app-budget-page',
  imports: [
    TitleComponent,
    BudgetComponent,
    DialogFormComponent,
    BudgetsTableComponent,
  ],
  templateUrl: './budget-page.component.html',
  styleUrl: './budget-page.component.css',
})
export class BudgetPageComponent {
  
  private readonly _userService = inject(UserService);

  // Lista de presupuestos del usuario
  public budgets = computed(() => this._userService.User()?.userBudgets || []);

  // Dialog state and selection
  public isTableVisible = false;
  public selectedBudgetId = signal<number | null>(null);// señal que emite el id del budget

  //?  Obtiene la lista del BudgetSELECCIONADO POR EL ID
  private getSelectedBudgetLists(): BudgetList[] {

    const id = this.selectedBudgetId();
    if (id == null) return [];

    const user = this._userService.User();
    if (!user) return [];

    const budget = user.userBudgets.find((b) => b.idBudget === id);
    return budget ? budget.budgetLists : [];
  }

  public selectedBudgetLists = computed<BudgetList[]>(() => this.getSelectedBudgetLists());

  constructor() {
    console.log(this.budgets());
  }

  OnEditIncomeById(id: number): void {
    console.log(id);
  }

  OnDeteleid(id: number): void {
    console.log(id);
  }

  onSelectBudget(id: number) {
  
    this.selectedBudgetId.set(id);
    this.isTableVisible = true;
  }

  closeTableDialog() {
    this.isTableVisible = false;
  }
}
