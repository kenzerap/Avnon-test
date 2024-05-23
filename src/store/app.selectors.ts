import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './app.reducer';

export const selectCounterpartiesState = createFeatureSelector<State>('app');

export const selectArticle = createSelector(
  selectCounterpartiesState,
  (state) => state.article
);
