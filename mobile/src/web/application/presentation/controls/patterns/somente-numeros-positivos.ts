import {NgModel} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive({
  selector: '[ngModel][somenteNumerosPositivos]',
  providers: [NgModel],
  host: {
    '(ngModelChange)': 'onInputChange($event)'
  }
})
export class SomenteNumerosPositivos {
  constructor(public model: NgModel) {
  }

  onInputChange(event) {
    if (event && event.toString().match(/[A-Za-z]/g)) {
      this.model.valueAccessor.writeValue(event.toString().replace(/[A-Za-z]/g, ''));
    }
    if (typeof event === 'number') {
      this.model.valueAccessor.writeValue(event.toString().replace(/^-\d*\.?\d+$/g, ''));
    }
  }
}
