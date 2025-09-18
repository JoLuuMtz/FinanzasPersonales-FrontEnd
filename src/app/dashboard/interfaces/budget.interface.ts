export interface BudgetDTO{
    name: string;
    description: string;
}


export interface CreateBudgetDTO{
    name: string;
    description: string;
}
export interface UpdateBudgetDTO {
    name?: string;
    description?: string;
}
