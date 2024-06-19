import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateArticleEditorComponent } from '../components/create-article-editor/create-article-editor.component';
import { ViewArticleEditorComponent } from '../components/view-article-editor/view-article-editor.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StoreModule } from '@ngrx/store';
import { appReducer } from '../store/app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DataAnalysisComponent } from '../components/data-analysis/data-analysis.component';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from '../store/app.effect';
import { HttpClientModule } from '@angular/common/http';
import { ChatGPTAnalysisComponent } from '../components/chatGPT-analysis/chatGPT-analysis.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTabsModule,
    CreateArticleEditorComponent,
    ViewArticleEditorComponent,
    DataAnalysisComponent,
    ChatGPTAnalysisComponent,
    StoreModule.forRoot({ app: appReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forRoot([AppEffects]),
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
