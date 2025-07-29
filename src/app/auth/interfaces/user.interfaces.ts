export interface UserData {
  idUser:        number;
  dni:           string;
  name:          string;
  lastName:      string;
  phone:         string;
  totalMoney:    number;
  email:         string;
  profileImagen?: string;
  dateRegister:  Date;
  userSpends:    UserSpend[];
  userIncomes:   UserIncome[];
  userBudgets:   UserBudget[];
}

export interface UserBudget {
  idBudget:    number;
  name:        string;
  description: string;
  date:        Date;
  budgetLists: BudgetList[];
}

export interface BudgetList {
  idBudgetCategory: number;
  name:             string;
  description:      string;
  amount:           number;
  date:             Date;
}

export interface UserIncome {
  idIncome:    number;
  name:        string;
  description: string;
  amount:      number;
  date:        Date;
  typeIncome:  TypeIncome;
}

export interface TypeIncome {
  idTypeIncomes: number;
  name:          string;
  description:   string;
}

export interface UserSpend {
  idSpend:     number;
  name:        string;
  description: string;
  amount:      number;
  date:        Date;
  typeSpend:   TypeSpend;
}

export interface TypeSpend {
  idTypeSpends: number;
  name:         string;
  description:  string;
}
