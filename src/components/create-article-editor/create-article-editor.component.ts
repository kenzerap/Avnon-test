import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
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
import { ImageHoverDirective } from '../../shared/image-hover.directive';
import { ImageComponentComponent } from '../image-component/image-component.component';
import { v4 as uuidv4 } from 'uuid';

declare const MediumEditor: any;

@Component({
  selector: 'app-create-article-editor',
  templateUrl: './create-article-editor.component.html',
  styleUrls: ['./create-article-editor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuillModule,
    MatButtonModule,
    ImageHoverDirective,
    ImageComponentComponent,
  ],
})
export class CreateArticleEditorComponent implements OnInit, OnDestroy {
  @ViewChild('articleTitle', { static: true }) articleTitle: ElementRef =
    new ElementRef(null);

  @ViewChild('articleContent', { static: true }) articleContent: ElementRef =
    new ElementRef(null);

  @ViewChild('toolbar', { static: true }) toolbar: ElementRef = new ElementRef(
    null
  );
  @ViewChild('uploadInput', { static: true }) uploadInput: ElementRef =
    new ElementRef(null);

  @ViewChild('imgTooltip', { static: true }) imgTooltip: ElementRef =
    new ElementRef(null);

  isExpand = false;
  isImgTooltipHover = false;
  mediumEditor: any = null;
  currentImgHover!: HTMLElement;

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    editor: new FormControl('', Validators.required),
  });

  completeSubject$ = new Subject();

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.mediumEditor = new MediumEditor(this.articleContent.nativeElement, {
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'quote', 'h3', 'h4'],
      },
      extensions: {
        placeholder: {},
      },
    });
  }

  onTitleChange(event: Event) {
    this.form.controls.title.setValue((event.target as HTMLElement).innerHTML);
  }

  onContentChange(event: Event) {
    this.form.controls.editor.setValue((event.target as HTMLElement).innerHTML);
    this.checkShowToolbar();
  }

  checkShowToolbar() {
    const element = this.articleContent.nativeElement as HTMLElement;
    const isNotInput = element.childNodes.length === 0;
    const isNewLine =
      element.childNodes.length > 0 &&
      ((element.lastChild?.childNodes.length === 0 &&
        !element.lastChild.nodeValue) ||
        ((element.lastChild?.childNodes.length || 0) > 0 &&
          element.lastChild?.childNodes[0].nodeName === 'BR'));

    if (isNotInput || isNewLine) {
      this.toolbar.nativeElement.style.display = 'grid';
      this.toolbar.nativeElement.style.top =
        ((element.lastChild as HTMLElement)?.offsetTop || 0) - 3 + 'px';
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

  uploadImage(event: Event) {
    this.toolbarToggle();

    const element = event.target as HTMLInputElement;
    if (element.files && element.files[0]) {
      const file = element.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const imgUrl = reader.result ? reader.result.toString() : '';

        const articleContentElement = this.articleContent
          .nativeElement as HTMLElement;
        const lastChild = articleContentElement.lastChild;

        const divImgElement = document.createElement('div');
        const imgElement = document.createElement('img');
        imgElement.id = uuidv4();
        imgElement.style.width = '80%';
        imgElement.style.height = 'auto';
        imgElement.src = imgUrl || '';
        imgElement.style.marginBottom = '2rem';

        imgElement.addEventListener('mouseenter', (e) => {
          this.currentImgHover = e.target as HTMLElement;
          const imgTooltipElement = this.imgTooltip
            .nativeElement as HTMLElement;
          imgTooltipElement.style.display = 'unset';
          imgTooltipElement.style.top =
            (e.target as HTMLElement).offsetTop - 30 + 'px';
          const width = (e.target as HTMLElement).clientWidth / 2 + 'px';
          imgTooltipElement.style.left = `calc(${width} - 5rem)`;
        });

        imgElement.addEventListener('mouseleave', (e) => {
          if (!this.isImgTooltipHover) {
            const imgTooltipElement = this.imgTooltip
              .nativeElement as HTMLElement;
            imgTooltipElement.style.display = 'none';
          }
        });

        divImgElement.appendChild(imgElement);
        lastChild?.replaceWith(divImgElement);

        if (lastChild) {
          lastChild.replaceWith(divImgElement);
        } else {
          articleContentElement.appendChild(divImgElement);
        }

        setTimeout(() => {
          const divCaptionElement = document.createElement('div');
          const captionElement = document.createElement('p');
          captionElement.id = `caption-${imgElement.id}`;
          captionElement.style.position = 'absolute';
          captionElement.style.top =
            imgElement.offsetTop + imgElement.offsetHeight + 10 + 'px';
          captionElement.style.left = '0';
          captionElement.style.width = 'calc(80% - 1px)';
          captionElement.style.padding = '0';
          captionElement.style.textAlign = 'center';
          captionElement.style.border = 'none';
          captionElement.style.outline = 'none';
          captionElement.style.height = '1.5rem';
          captionElement.style.opacity = '0.5';

          const placeholderElement = document.createElement('span');
          placeholderElement.innerText = 'Caption';
          placeholderElement.style.pointerEvents = 'none';
          placeholderElement.style.position = 'absolute';
          placeholderElement.style.left = '0';
          placeholderElement.style.width = '100%';
          captionElement.appendChild(placeholderElement);

          divCaptionElement.appendChild(captionElement);
          articleContentElement.prepend(divCaptionElement);

          captionElement.addEventListener('change', (e) => {
            if (
              (e.target as HTMLElement).innerText !==
              'Caption'
            ) {
              placeholderElement.style.display = 'none';
            } else {
              placeholderElement.style.display = 'unset';
            }
          });

          this.form.controls.editor.setValue(articleContentElement.innerHTML);
          this.checkShowToolbar();
        }, 0);

        this.uploadInput.nativeElement.value = '';
      };
    }
  }

  setImgTooltipHover(ishover: boolean) {
    this.isImgTooltipHover = ishover;
    const imgTooltipElement = this.imgTooltip.nativeElement as HTMLElement;
    imgTooltipElement.style.display = 'unset';
  }

  imgTooltipMouseOut() {
    this.setImgTooltipHover(false);
    const imgTooltipElement = this.imgTooltip.nativeElement as HTMLElement;
    imgTooltipElement.style.display = 'none';
  }

  selectSizeOption(sizeOption: number) {
    const id = this.currentImgHover.id;
    const caption = document.getElementById(`caption-${id}`);
    switch (sizeOption) {
      case 0:
        this.currentImgHover.style.width = '40%';
        if (caption) {
          caption.style.width = '40%';
          caption.style.top =
            this.currentImgHover.offsetTop +
            this.currentImgHover.offsetHeight +
            10 +
            'px';
        }
        break;
      case 1:
        this.currentImgHover.style.width = '80%';
        if (caption) {
          caption.style.width = '80%';
          caption.style.top =
            this.currentImgHover.offsetTop +
            this.currentImgHover.offsetHeight +
            10 +
            'px';
        }
        break;
      case 2:
        this.currentImgHover.style.width = '100%';
        if (caption) {
          caption.style.width = '100%';
          caption.style.top =
            this.currentImgHover.offsetTop +
            this.currentImgHover.offsetHeight +
            10 +
            'px';
        }
        break;

      default:
        break;
    }

    const articleContentElement = this.articleContent
      .nativeElement as HTMLElement;
    this.form.controls.editor.setValue(articleContentElement.innerHTML);
  }

  ngOnDestroy(): void {
    this.completeSubject$.next(null);
    this.completeSubject$.complete();
  }
}
