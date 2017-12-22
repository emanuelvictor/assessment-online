import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../../../service/authentication.service";
import {textMasks} from '../../../../../../application/controls/text-masks/text-masks';
import {Ficha} from "../../../../../entity/fornecedor/ficha.model";
import {FichaService} from "../../../../../service/ficha.service";

@Component({
  selector: 'visualizar-dados-ficha',
  templateUrl: './visualizar-dados-ficha.component.html',
  styleUrls: ['./visualizar-dados-ficha.component.css']
})
export class VisualizarDadosFichaComponent implements OnInit {

  /**
   *
   */
  @Input()
  ficha: Ficha = new Ficha;

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
   * @type {string}
   */
  url: string = '';

  /**
   *
   * @param {ActivatedRoute} activatedRoute
   * @param {AuthenticationService} authenticationService
   * @param {FichaService} fichaService
   */
  constructor(public activatedRoute: ActivatedRoute,
              public authenticationService: AuthenticationService,
              public fichaService: FichaService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.url = this.fichaService.getQrcodeByFichaId(this.ficha.id);
    this.authenticatedUser = this.authenticationService.getObservedAuthenticatedUser();
  }
}
