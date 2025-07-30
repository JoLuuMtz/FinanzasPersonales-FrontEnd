import { Component, Input } from '@angular/core';

@Component({
  selector: 'title-component',
  imports: [],
  template: ` <h1 class="text-white ">{{ title }}</h1> `,
})
export class TitleComponent {

  @Input()
  public title: string = '';
}
