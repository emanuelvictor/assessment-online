import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'virgula'
})
export class VirgulaPipe implements PipeTransform {
  transform(value: any): any {
    if (value) {
      value = value.toString();
      return value.replace('.', ',');
    }
    return value;

  }
}