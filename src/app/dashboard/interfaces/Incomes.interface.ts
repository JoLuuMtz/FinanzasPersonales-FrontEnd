export interface IncomeDTO {
  name:          string;
  description:   string;
  amount:        number;
  date:          Date;
  idTypeIncomes: number;
}
export interface IncomeUpdateDTO {
  name?:          string;
  description?:   string;
  amount?:        number;
  date?:          Date;
}

