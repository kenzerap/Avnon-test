import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  input,
} from '@angular/core';

@Component({
  selector: 'app-image-component',
  templateUrl: './image-component.component.html',
  styleUrls: ['./image-component.component.scss'],
  standalone: true,
})
export class ImageComponentComponent implements OnInit {
  @Input() selected: number = 1;
  @Output() selectSizeOption = new EventEmitter<number>();
  constructor() {}

  ngOnInit() {}

  selectSize(sizeOption: number) {
    this.selectSizeOption.emit(sizeOption);
  }
}
