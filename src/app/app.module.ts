import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateArticleEditorComponent } from '../components/create-article-editor/create-article-editor.component';
import { ViewArticleEditorComponent } from '../components/view-article-editor/view-article-editor.component';
import { QuillModule } from 'ngx-quill';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StoreModule } from '@ngrx/store';
import { appReducer } from '../store/app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CreateArticleEditorComponent,
    ViewArticleEditorComponent,
    StoreModule.forRoot({ app: appReducer }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
