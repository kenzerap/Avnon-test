import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateArticleEditorComponent } from '../components/create-article-editor/create-article-editor.component';
import { ViewArticleEditorComponent } from '../components/view-article-editor/view-article-editor.component';
import { DataAnalysisComponent } from '../components/data-analysis/data-analysis.component';
import { ChatGPTAnalysisComponent } from '../components/chatGPT-analysis/chatGPT-analysis.component';

const routes: Routes = [
  { path: 'editor', component: CreateArticleEditorComponent },
  { path: 'article/preview', component: ViewArticleEditorComponent },
  { path: 'data-analysis', component: DataAnalysisComponent },
  { path: 'chatGPT-analysis', component: ChatGPTAnalysisComponent },
  { path: '', redirectTo: '/data-analysis', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
