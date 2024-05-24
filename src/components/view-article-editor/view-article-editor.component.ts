import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectArticle } from '../../store/app.selectors';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-view-article-editor',
  templateUrl: './view-article-editor.component.html',
  styleUrls: ['./view-article-editor.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ViewArticleEditorComponent implements OnInit {
  article$ = this.store.pipe(select(selectArticle));
  article: any = null;
  constructor(private store: Store, private sanitized: DomSanitizer) {}

  ngOnInit() {
    this.article$
      .pipe(
        take(1),
        filter((item) => !!item)
      )
      .subscribe((item) => {
        this.article = {
          ...item,
          content: this.sanitized.bypassSecurityTrustHtml(item.content),
        };
      });
  }
}
