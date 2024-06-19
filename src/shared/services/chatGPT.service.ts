import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { CompanyDataAnalysis } from '../models/company-data-analysis.model';
import { environment } from '../../environments/environment';
import { ChatGPTResponse } from '../models/chatGPT-response.model';

@Injectable({
  providedIn: 'root',
})
export class ChatGPTService {
  constructor(private http: HttpClient) {}

  postMessage(prompt: string): Observable<ChatGPTResponse> {
    const apiKey = environment.chatGPTKey;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    console.log('chatGPTKey: ', environment.chatGPTKey);

    const data = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    return this.http.post<ChatGPTResponse>(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }
}
