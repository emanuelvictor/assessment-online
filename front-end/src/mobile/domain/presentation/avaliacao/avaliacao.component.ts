import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {MobileService} from "../../service/mobile.service";

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
   * @param mobileService
   */
  constructor(private router: Router,
              public mobileService: MobileService) {
  }

}
