import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../../../service/authentication.service";
import {textMasks} from '../../../../../../application/controls/text-masks/text-masks';
import {Entrada} from "../../../../../entity/entrada/entrada.model";

@Component({
  selector: 'visualizar-dados-entrada',
  templateUrl: './visualizar-dados-entrada.component.html',
  styleUrls: ['./visualizar-dados-entrada.component.css']
})
export class VisualizarDadosEntradaComponent implements OnInit {

  /**
   *
   */
  @Input()
  entrada: Entrada = new Entrada;

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
   */
  public areasAtuacao: any[];

  /**
   *
   * @param activatedRoute
   * @param authenticatedUserService
   */
  constructor(public activatedRoute: ActivatedRoute,
              public authenticationService: AuthenticationService) {
  }

  /**
   *
   */
  ngOnInit() {
  }
}
