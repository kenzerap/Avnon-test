export interface CompanyDataAnalysis {
  CompanyName: string;
  MonthID: number;
  YearID: number;
  TotalIncome: number;
  TotalExpenses?: number;
  CostofSales?: number;
  IgnoreException: number;
  Profit: number;
}

export interface DataAnalysis {
  [companyName: string]: YearMonthData;
}

export interface YearMonthData {
  [yearID: string]: {
    [monthID: string]: {
      TotalIncome: number;
      TotalExpenses?: number;
      CostofSales?: number;
      IgnoreException: number;
      Profit: number;
    };
  };
}
