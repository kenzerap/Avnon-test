import { createReducer, on } from '@ngrx/store';
import { saveArticle } from './app.actions';

export interface State {
  article: any;
}

export const initialState: State = {
  article: null,
};

export const appReducer = createReducer(
  initialState,
  on(saveArticle, (state, { article }) => {
    return {
      ...state,
      article,
    };
  })
);
