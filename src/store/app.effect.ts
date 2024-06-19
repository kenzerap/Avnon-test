import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataAnalysisService } from '../shared/services/data-analysis.service';
import * as appActions from './app.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ChatGPTService } from '../shared/services/chatGPT.service';
import { ChatGPTResponse } from '../shared/models/chatGPT-response.model';

@Injectable()
export class AppEffects {
  getDataAnalysis$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.getDataAnalysis),
      mergeMap(() => {
        return this.dataAnalysisService.getDataAnalysis().pipe(
          map((data) => {
            return appActions.getDataAnalysisSucess({ data });
          }),
          catchError((error) => {
            return of(appActions.getDataAnalysisFailed({ error }));
          })
        );
      })
    )
  );

  postChatGPT$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.postChatGPT),
      mergeMap(({ message }) => {
        return this.chatGPTService.postMessage(message).pipe(
          map((data: ChatGPTResponse) => {
            const answerMessage = data.choices[0].message.content;
            return appActions.postChatGPTSucess({ data: answerMessage });
          }),
          catchError((error) => {
            return of(appActions.postChatGPTFailed({ error }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private dataAnalysisService: DataAnalysisService,
    private chatGPTService: ChatGPTService
  ) {}
}
