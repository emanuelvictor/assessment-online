import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {environment} from "../../../../../../environments/environment";
import {getIdentifier} from "../../../../../../web/domain/presentation/controls/utils";
import {MobileService} from "../../../../service/mobile.service";

@Component({
  selector: 'configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent {
}
