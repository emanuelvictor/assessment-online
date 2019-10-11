import {NgModel} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive({
  selector: '[ngModel][noWhiteSpace]',
  providers: [NgModel],
  host: {
    '(ngModelChange)': 'onInputChange($event)'
  }
})
export class NoWhiteSpace {
  constructor(public model: NgModel) {
  }

  onInputChange(event) {
    if (event) {
      this.model.valueAccessor.writeValue(event.replace(/(^\s+|\s+$)/g, ''));
    }
  }
}
