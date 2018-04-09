import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  /**
   * Perform the filtering.
   *
   * @param {any} object The object to compare to the filter.
   * @param {any} filter The filter to apply.
   * @return {boolean} True if object satisfies filters, false if not.
   */
  static applyFilter(object: any, filter: any): boolean {
    for (const field in filter) {
      if (filter[field]) {
        if (typeof filter[field] === 'string') {
          if (object[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
            return false;
          }
        } else if (typeof filter[field] === 'number') {
          if (object[field] !== filter[field]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   *
   * @param {any[]} items
   * @param filter
   * @returns {any[]}
   */
  transform(items: any[], filter: any): any[] {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: any) => FilterPipe.applyFilter(item, filter));
  }

}
