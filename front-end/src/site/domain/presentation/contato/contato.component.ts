import {Component} from '@angular/core';

@Component({
  selector: 'contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.scss']
})
export class ContatoComponent {

  /**
   *
   */
  mensagem: any = {};

  /**
   *
   */
  constructor() {
  }

  /**
   *
   */
  send() {
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    window['Materialize'].toast(message, 5000);
  }

}
