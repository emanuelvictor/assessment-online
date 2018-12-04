import {Component} from '@angular/core';
import {getIdentifier} from "../../../../web/domain/presentation/controls/utils";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss']
})
export class AvaliacaoComponent {

  backgroundImage: string = environment.endpoint + './configuracoes/background' + '?nocache=' + getIdentifier();

}
