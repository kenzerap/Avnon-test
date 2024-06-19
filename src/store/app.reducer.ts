import { createReducer, on } from '@ngrx/store';
import * as appActions from './app.actions';
import { DataAnalysis } from '../shared/models/company-data-analysis.model';

export interface State {
  article: any;
  dataAnalysis: DataAnalysis;
  chatGPTAnswer: string;
  dataAnalysisChatGPT: any;
}

export const initialState: State = {
  article: null,
  dataAnalysis: {},
  chatGPTAnswer: '',
  dataAnalysisChatGPT: null,
};

export const appReducer = createReducer(
  initialState,
  on(appActions.saveArticle, (state, { article }) => {
    return {
      ...state,
      article,
    };
  }),
  on(appActions.getDataAnalysisSucess, (state, { data }) => {
    const transferData: DataAnalysis = {};
    data.map((item) => {
      transferData[item.CompanyName] = {
        ...transferData[item.CompanyName],
        [item.YearID]: {
          ...transferData[item.CompanyName]?.[item.YearID],
          [item.MonthID]: {
            ...transferData[item.CompanyName]?.[item.YearID]?.[item.MonthID],
            TotalIncome: item.TotalIncome,
            TotalExpenses: item.TotalExpenses,
            CostofSales: item.CostofSales,
            IgnoreException: item.IgnoreException,
            Profit: item.TotalIncome - (item.TotalExpenses || 0),
          },
        },
      };
    });
    return {
      ...state,
      dataAnalysis: transferData,
    };
  }),
  on(appActions.postChatGPT, (state) => {
    return {
      ...state,
      chatGPTAnswer: 'Analysing...',
    };
  }),
  on(appActions.postChatGPTSucess, (state, { data }) => {
    return {
      ...state,
      chatGPTAnswer: data,
    };
  }),
  on(appActions.saveDataToChartGPT, (state, { selectedDate }) => {
    const maxDate = selectedDate || new Date();

    const maxMonth = maxDate.getMonth();
    const maxYear = maxDate.getFullYear();

    const originData = state.dataAnalysis;

    const customData: any = [];
    Object.keys(originData).map((key, index) => {
      if (index >= 50) {
        return;
      }

      const min = new Date(maxDate);
      min.setMonth(maxDate.getMonth() - 11);

      while (min.getMonth() <= maxMonth || min.getFullYear() !== maxYear) {
        const data = {
          companyName: key,
          date: new Date(min).toDateString(),
          income:
            originData[key]?.[min.getFullYear()]?.[min.getMonth() + 1]
              ?.TotalIncome,
          profit:
            originData[key]?.[min.getFullYear()]?.[min.getMonth() + 1]?.Profit,
        };

        if (data.income || data.profit) {
          customData.push(data);
        }

        min.setMonth(min.getMonth() + 1);
      }
    });

    return {
      ...state,
      dataAnalysisChatGPT: customData,
    };
  })
);
