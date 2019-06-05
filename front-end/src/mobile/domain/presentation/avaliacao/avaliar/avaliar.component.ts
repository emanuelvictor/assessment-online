import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MobileService} from '../../../service/mobile.service';
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material";
import {AuthenticationService} from "../../../../../web/domain/service/authentication.service";
import {Configuracao} from "../../../../../web/domain/entity/configuracao/configuracao.model";
import {ConfiguracaoService} from "../../../../../web/domain/service/configuracao.service";
import {Agrupador} from "../../../../../web/domain/entity/avaliacao/agrupador.model";

@Component({
  selector: 'avaliar',
  templateUrl: './avaliar.component.html',
  styleUrls: ['./avaliar.component.scss']
})
export class AvaliarComponent {
}
