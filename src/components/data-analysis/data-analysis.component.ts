import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import * as appActions from '../../store/app.actions';
import * as appSelectors from '../../store/app.selectors';
import { MonthsPerYear } from '../../shared/constants/months-per-year.const';
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  DataAnalysis,
  YearMonthData,
} from '../../shared/models/company-data-analysis.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    DecimalPipe,
    MatTooltipModule,
    MatButtonModule,
  ],
  providers: [DecimalPipe],
})
export class DataAnalysisComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['company'];
  displayedSubColumns: string[] = [];
  displayedAllColumns: string[] = [];

  selectedDateControl = new FormControl(new Date());
  monthsPerYear = MonthsPerYear;

  dataAnalysis$: Observable<any[]> = this.store.select(
    appSelectors.selectTableDataAnalysis
  );

  unsubscribeSubject$ = new Subject();

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(appActions.getDataAnalysis());
    this.changeHeaderByDate(this.selectedDateControl.value);

    this.selectedDateControl.valueChanges
      .pipe(takeUntil(this.unsubscribeSubject$))
      .subscribe((value) => {
        this.changeHeaderByDate(value);
      });
  }

  getSubHeaderTitle(item: string) {
    return item.includes('-Income') ? 'Income' : 'Profit';
  }

  changeHeaderByDate(selectedDate: Date | null) {
    const maxDate = selectedDate || new Date();
    const minDate = new Date(maxDate);
    minDate.setMonth(maxDate.getMonth() - 11);

    const maxMonth = maxDate.getMonth();
    const maxYear = maxDate.getFullYear();

    this.displayedColumns = ['company'];
    this.displayedSubColumns = [];
    this.displayedAllColumns = [];

    while (
      minDate.getMonth() <= maxMonth ||
      minDate.getFullYear() !== maxYear
    ) {
      const monthLabel = `${minDate.getFullYear()}-${
        MonthsPerYear[minDate.getMonth() + 1]
      }`;
      this.displayedColumns.push(monthLabel);

      this.displayedSubColumns = [
        ...this.displayedSubColumns,
        `${monthLabel}-Income`,
        `${monthLabel}-Profit`,
      ];

      this.displayedAllColumns = ['company', ...this.displayedSubColumns];

      minDate.setMonth(minDate.getMonth() + 1);
    }
  }

  isIncome(headerKey: string) {
    return headerKey.includes('-Income');
  }

  getValueColumn(item: YearMonthData, headerKey: string): number {
    const [year, monthLabel, type] = headerKey.split('-');
    const monthId =
      Object.keys(MonthsPerYear).find(
        (key) => MonthsPerYear[key] === monthLabel
      ) || '';

    return type === 'Income'
      ? item[year]?.[monthId]?.TotalIncome || 0
      : item[year]?.[monthId]?.Profit || 0;
  }

  calculateChangeValue(item: YearMonthData, headerKey: string): number {
    const headerIndex = this.displayedSubColumns.findIndex(
      (item) => item === headerKey
    );

    if (headerIndex === 0 || headerIndex === 1) {
      return 0;
    }

    const [year, monthLabel, type] = headerKey.split('-');
    const monthId =
      Object.keys(MonthsPerYear).find(
        (key) => MonthsPerYear[key] === monthLabel
      ) || '';
    const currentValue =
      type === 'Income'
        ? item[year]?.[monthId]?.TotalIncome || 0
        : item[year]?.[monthId]?.Profit || 0;

    const [prevYear, prevMonthLabel] =
      this.displayedSubColumns[headerIndex - 2].split('-');
    const prevMonthId =
      Object.keys(MonthsPerYear).find(
        (key) => MonthsPerYear[key] === prevMonthLabel
      ) || '';
    const previousValue =
      type === 'Income'
        ? item[prevYear]?.[prevMonthId]?.TotalIncome || 0
        : item[prevYear]?.[prevMonthId]?.Profit || 0;

    let changeValue = 0;

    if (previousValue !== 0 && currentValue !== 0) {
      changeValue =
        ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
    }

    return changeValue;
  }

  checkIdenticalIncomeAndExpenses(
    item: YearMonthData,
    headerKey: string
  ): boolean {
    const [year, monthLabel] = headerKey.split('-');
    const monthId =
      Object.keys(MonthsPerYear).find(
        (key) => MonthsPerYear[key] === monthLabel
      ) || '';

    return (
      !!item[year]?.[monthId]?.TotalIncome &&
      item[year]?.[monthId]?.TotalIncome ===
        item[year]?.[monthId]?.TotalExpenses
    );
  }

  checkDataNotCaptured(item: YearMonthData, headerKey: string) {
    const [year, monthLabel] = headerKey.split('-');
    const monthId =
      Object.keys(MonthsPerYear).find(
        (key) => MonthsPerYear[key] === monthLabel
      ) || '';

    return !item[year]?.[monthId]?.TotalIncome;
  }

  tooltipText(changeValue: number, item: YearMonthData, headerKey: string) {
    if (changeValue > 300) {
      return 'Revenue Surge';
    }

    if (changeValue < -100) {
      return 'Extreme Profit Drop';
    }

    const isIncome = this.isIncome(headerKey);
    const [year, monthLabel] = headerKey.split('-');
    const monthId =
      Object.keys(MonthsPerYear).find(
        (key) => MonthsPerYear[key] === monthLabel
      ) || '';

    const checkIdenticalIncomeAndExpenses =
      !!item[year]?.[monthId]?.TotalIncome &&
      item[year]?.[monthId]?.TotalIncome ===
        item[year]?.[monthId]?.TotalExpenses;

    if (isIncome && checkIdenticalIncomeAndExpenses) {
      return 'Identical Income and Expenses';
    }

    const checkDataNotCaptured = !item[year]?.[monthId]?.TotalIncome;

    if (isIncome && checkDataNotCaptured) {
      return 'Data not Captured';
    }

    return null;
  }

  gotoChatGPTAnalysis() {
    if (this.selectedDateControl.value) {
      this.store.dispatch(
        appActions.saveDataToChartGPT({
          selectedDate: new Date(this.selectedDateControl.value),
        })
      );

      this.router.navigate(['chatGPT-analysis']);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeSubject$.next(null);
    this.unsubscribeSubject$.complete();
  }
}
