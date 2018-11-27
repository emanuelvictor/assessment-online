import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/pt-br';


@Component({
  selector: 'ev-datepicker',
  templateUrl: 'ev-datepicker.html',
  styleUrls: ['ev-datepicker.scss']
})
export class EvDatepicker implements OnChanges, OnInit {

  /**
   *
   */
  @Input() dataInput: any;

  /**
   *
   */
  data: any;

  /**
   *
   * @type {EventEmitter}
   */
  @Output() dataInputChange = new EventEmitter();

  /**
   *
   * @returns {boolean}
   */
  private static validateDate(date): boolean {
    if (date != null && moment(date, 'DD/MM/YYYY').isValid())
      if (typeof date === "string")
        return date.replace('/', '').replace('/', '').length >= 8;
      else
        return true;
  }

  /**
   *
   */
  changeData(date) {
    if (EvDatepicker.validateDate(date))
      this.dataInputChange.emit(moment(date, 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY'));
    if (!date || date.length == 0)
      this.dataInputChange.emit(null);
  }

  /**
   *
   */
  ngOnInit(): void {
    if (this.dataInput)
      this.data = moment(this.dataInput, 'DD/MM/YYYY').locale('pt-BR').toDate();
  }

  /**
   *
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (!changes.dataInput.firstChange) {
      if (EvDatepicker.validateDate(changes.dataInput.currentValue))
        this.dataInputChange.emit(moment(moment(changes.dataInput.currentValue, 'DD/MM/YYYY').locale('pt-BR').toDate(), 'DD/MM/YYYY').locale('pt-BR').format('DD/MM/YYYY'));
      if (!changes.dataInput.currentValue || changes.dataInput.currentValue.length == 0)
        this.dataInputChange.emit(null);
    }
  }

}
