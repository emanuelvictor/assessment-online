import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../../../../../service/authentication.service";
import {textMasks} from '../../../../../../application/controls/text-masks/text-masks';
import {Usuario} from "../../../../../entity/usuario/usuario.model";

@Component({
  selector: 'visualizar-dados-usuario',
  templateUrl: './visualizar-dados-usuario.component.html',
  styleUrls: ['./visualizar-dados-usuario.component.css']
})
export class VisualizarDadosUsuarioComponent implements OnInit {

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/

  /**
   *
   */
  @Input()
  usuario: Usuario = new Usuario;

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
  public areasInteresse: any[];

  /**
   *
   */
  public areasAtuacao: any[];

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/

  /**
   *
   * @param activatedRoute
   * @param authenticatedUserService
   */
  constructor(public activatedRoute: ActivatedRoute,
              public authenticationService: AuthenticationService) {
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  ngOnInit() {
    this.authenticatedUser = this.authenticationService.getObservedAuthenticatedUser();
  }
}
