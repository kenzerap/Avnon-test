import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CompanyDataAnalysis } from '../models/company-data-analysis.model';

@Injectable({
  providedIn: 'root',
})
export class DataAnalysisService {
  constructor(private http: HttpClient) {}

  getDataAnalysis(): Observable<CompanyDataAnalysis[]> {
    return this.http
      .get('../../assets/data/Source-Data.json')
      .pipe(map((data) => data as CompanyDataAnalysis[]));
  }
}
