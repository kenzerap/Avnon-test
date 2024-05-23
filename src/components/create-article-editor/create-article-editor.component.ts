import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { QuillModule } from 'ngx-quill';
import { Subject, filter, takeUntil } from 'rxjs';
import { saveArticle } from '../../store/app.actions';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
declare const MediumEditor: any;

@Component({
  selector: 'app-create-article-editor',
  templateUrl: './create-article-editor.component.html',
  styleUrls: ['./create-article-editor.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuillModule, MatButtonModule],
})
export class CreateArticleEditorComponent implements OnInit, OnDestroy {
  @ViewChild('articleTitle', { static: true }) articleTitle: ElementRef =
    new ElementRef(null);

  @ViewChild('toolbar', { static: true }) toolbar: ElementRef = new ElementRef(
    null
  );

  isInitEditor = false;
  isExpand = false;
  mediumEditor: any = null;

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    editor: new FormControl('', Validators.required),
  });

  completeSubject$ = new Subject();

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.form.controls.editor.valueChanges
      .pipe(
        filter(() => this.isInitEditor),
        takeUntil(this.completeSubject$)
      )
      .subscribe((value) => {
        this.checkShowToolbar();

        const elements = document.getElementsByClassName('ql-editor');
        const listContent =
          elements.length > 0 ? elements[0].querySelectorAll('p') : [];
        if (
          listContent[listContent.length - 1]?.firstChild?.nodeName === 'IMG'
        ) {
          const imageHtmlElement = listContent[listContent.length - 1]
            .firstElementChild as HTMLElement;
          imageHtmlElement.style.width = '40%';
          imageHtmlElement.style.height = 'auto';
        }
      });
  }

  checkShowToolbar() {
    const elements = document.getElementsByClassName('ql-editor');
    const listContent =
      elements.length > 0 ? elements[0].querySelectorAll('p') : [];
    if (
      listContent.length > 0 &&
      listContent[listContent.length - 1].innerText === '\n'
    ) {
      this.toolbar.nativeElement.style.display = 'grid';
      this.toolbar.nativeElement.style.top =
        (listContent[listContent.length - 1].offsetTop || 0) - 3 + 'px';
    } else {
      this.toolbar.nativeElement.style.display = 'none';
    }
  }

  toolbarToggle() {
    this.isExpand = !this.isExpand;
  }

  submitForm() {
    this.store.dispatch(
      saveArticle({
        article: {
          title: this.form.value.title,
          content: this.form.value.editor,
        },
      })
    );

    this.router.navigate(['article', 'preview']);
  }

  uploadImage() {
    const btnImage = document.getElementsByClassName('ql-image');
    if (btnImage.length > 0) {
      (btnImage[0] as HTMLElement).click();
    }

    this.toolbarToggle();
  }

  initEditor() {
    const element = document.getElementsByClassName('ql-container');

    if (
      element.length > 0 &&
      this.articleTitle &&
      this.toolbar &&
      !this.isInitEditor
    ) {
      element[0].prepend(this.articleTitle.nativeElement);
      element[0].prepend(this.toolbar.nativeElement);
      this.isInitEditor = true;
    }

    const qlEditor = document.getElementsByClassName('ql-editor');
    if (qlEditor.length > 0) {
      this.mediumEditor = new MediumEditor(qlEditor[0], {
        toolbar: {
          buttons: ['bold', 'italic', 'underline', 'anchor', 'quote'],
        },
        extensions: {
          placeholder: {},
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.completeSubject$.next(null);
    this.completeSubject$.complete();
  }
}
