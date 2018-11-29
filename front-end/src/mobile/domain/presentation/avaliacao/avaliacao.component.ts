import {Component} from '@angular/core';
import {getIdentifier} from "../../../../web/domain/presentation/controls/utils";

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss']
})
export class AvaliacaoComponent {

  backgroundImage: string = './configuracoes/background' + '?nocache=' + getIdentifier();

  constructor(){

  }

}
