import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../../../service/authentication.service";
import {textMasks} from '../../../../../../application/controls/text-masks/text-masks';
import {Atendente} from "../../../../../entity/atendente/atendente.model";

@Component({
  selector: 'visualizar-dados-usuario',
  templateUrl: './visualizar-dados-usuario.component.html',
  styleUrls: ['./visualizar-dados-usuario.component.css']
})
export class VisualizarDadosAtendenteComponent implements OnInit {

  /**
   *
   */
  @Input()
  usuario: Atendente = new Atendente;

  /**
   *
   */
  textMasks: any = textMasks;

  /**
   *
   */
  authenticatedUser;

  /**
   *
   * @param {ActivatedRoute} activatedRoute
   * @param {AuthenticationService} authenticationService
   */
  constructor(public activatedRoute: ActivatedRoute,
              public authenticationService: AuthenticationService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.authenticatedUser = this.authenticationService.getObservedAuthenticatedUser();
  }
}
