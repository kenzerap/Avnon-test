import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateArticleEditorComponent } from '../components/create-article-editor/create-article-editor.component';
import { ViewArticleEditorComponent } from '../components/view-article-editor/view-article-editor.component';

const routes: Routes = [
  { path: 'editor', component: CreateArticleEditorComponent },
  { path: 'article/preview', component: ViewArticleEditorComponent },
  { path: '', redirectTo: '/editor', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
