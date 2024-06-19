import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './app.reducer';
import { DataAnalysis } from '../shared/models/company-data-analysis.model';

export const selectAppState = createFeatureSelector<State>('app');

export const selectArticle = createSelector(
  selectAppState,
  (state) => state.article
);

export const selectDataAnalysis = createSelector(
  selectAppState,
  (state) => state.dataAnalysis
);

export const selectTableDataAnalysis = createSelector(
  selectAppState,
  (state) => {
    return Object.entries(state.dataAnalysis);
  }
);

export const selectChatGPTData = createSelector(selectAppState, (state) => {
  return state.dataAnalysis;
});

export const selectChatGPTAnswer = createSelector(selectAppState, (state) => {
  return state.chatGPTAnswer;
});

export const selectDataAnalysisChatGPT = createSelector(
  selectAppState,
  (state) => {
    return state.dataAnalysisChatGPT;
  }
);
