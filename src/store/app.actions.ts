import { createAction, props } from '@ngrx/store';

export const saveArticle = createAction(
  '[article] Save article',
  props<{ article: any }>()
);
