import { createAction, props } from '@ngrx/store';
import { CompanyDataAnalysis } from '../shared/models/company-data-analysis.model';

export const saveArticle = createAction(
  '[article] Save article',
  props<{ article: any }>()
);

export const getDataAnalysis = createAction(
  '[data analysis] get data analysis'
);

export const getDataAnalysisSucess = createAction(
  '[data analysis] get data analysis - success',
  props<{ data: CompanyDataAnalysis[] }>()
);

export const getDataAnalysisFailed = createAction(
  '[data analysis] get data analysis - failed',
  props<{ error: any }>()
);

export const postChatGPT = createAction(
  '[chatGPT] post chatGPT',
  props<{ message: string }>()
);

export const postChatGPTSucess = createAction(
  '[chatGPT] post chatGPT - success',
  props<{ data: string }>()
);

export const postChatGPTFailed = createAction(
  '[chatGPT] post chatGPT - failed',
  props<{ error: any }>()
);

export const saveDataToChartGPT = createAction(
  '[chatGPT] save data to chatGPT',
  props<{ selectedDate: Date }>()
);
