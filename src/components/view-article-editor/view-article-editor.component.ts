import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectArticle } from '../../store/app.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-article-editor',
  templateUrl: './view-article-editor.component.html',
  styleUrls: ['./view-article-editor.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ViewArticleEditorComponent implements OnInit {
  article$ = this.store.pipe(select(selectArticle));
  constructor(private store: Store) {}

  ngOnInit() {}
}
