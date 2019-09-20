import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss']
})
export class AvaliacaoComponent {

  /**
   *
   */
  backgroundImage: string = './configuracoes/background?cliente=public';

  /**
   *
   * @param router
   */
  constructor(private router: Router) {
  }

}
