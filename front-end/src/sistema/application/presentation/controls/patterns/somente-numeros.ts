import {NgModel} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive({
  selector: '[ngModel][somenteNumeros]',
  providers: [NgModel],
  host: {
    '(ngModelChange)': 'onInputChange($event)'
  }
})
export class SomenteNumeros {
  constructor(public model: NgModel) {
  }

  onInputChange(event) {
    if (event && event.toString().match(/[A-Za-z]/g)) {
      this.model.valueAccessor.writeValue(event.toString().replace(/[A-Za-z]/g, ''));
    }
  }
}
