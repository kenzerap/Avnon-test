import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appImageHover]',
  standalone: true,
})
export class ImageHoverDirective {
  constructor(private element: ElementRef) {
    console.log('ImageHoverDirective');
  }

  @HostListener('mouseenter') onMouseEnter() {
    const imgElement = (
      this.element.nativeElement as HTMLElement
    ).querySelectorAll('img');
    if (imgElement.length > 0) {
      console.log('mouseenter: ', imgElement);
    }
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.element.nativeElement.style.backgroundColor = color;
  }
}
