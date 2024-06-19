import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import * as appSelectors from '../../store/app.selectors';
import { CommonModule } from '@angular/common';
import * as appActions from '../../store/app.actions';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatGPT-analysis',
  templateUrl: './chatGPT-analysis.component.html',
  styleUrls: ['./chatGPT-analysis.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class ChatGPTAnalysisComponent implements OnInit, OnDestroy {
  form = new FormGroup({
    promptContent: new FormControl(''),
    questionInput: new FormControl(''),
  });
  chatGPTAnswer$ = this.store.select(appSelectors.selectChatGPTAnswer);
  dataAnalysis$: Observable<any[]> = this.store.select(
    appSelectors.selectDataAnalysisChatGPT
  );

  dataAnalysisString = '';
  unsubscribeSubject$ = new Subject();

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.dataAnalysis$
      .pipe(takeUntil(this.unsubscribeSubject$))
      .subscribe((data) => {
        console.log('dataAnalysis: ', data);
        this.dataAnalysisString = JSON.stringify(data);
      });
  }

  pushQuestion() {
    if (this.form.controls.questionInput.value) {
      this.form.controls.promptContent.setValue(
        this.form.controls.questionInput.value
      );

      const message = `I have a data Json like this: ${this.dataAnalysisString}. Question is: ${this.form.controls.questionInput.value}`;

      this.store.dispatch(
        appActions.postChatGPT({
          message,
        })
      );

      this.form.controls.questionInput.reset();
    }
  }

  gotoDataAnalysis() {
    this.router.navigate(['data-analysis']);
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject$.next(null);
    this.unsubscribeSubject$.complete();
  }
}
