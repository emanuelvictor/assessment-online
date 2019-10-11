import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../../../service/authentication.service';
import {textMasks} from '../../../../controls/text-masks/text-masks';
import {Usuario} from '../../../../../entity/usuario/usuario.model';
import {FileRepository} from '../../../../../../infrastructure/repository/file/file.repository';

@Component({
  selector: 'visualizar-dados-cliente',
  templateUrl: './visualizar-dados-cliente.component.html',
  styleUrls: ['./visualizar-dados-cliente.component.css']
})
export class VisualizarDadosClienteComponent implements OnInit {


  /**
   *
   */
  foto: string;

  /**
   *
   */
  @Input()
  usuario: Usuario;

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
   * @param {FileRepository} fileRepository
   * @param {AuthenticationService} authenticationService
   */
  constructor(public activatedRoute: ActivatedRoute,
              public fileRepository: FileRepository,
              public authenticationService: AuthenticationService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.authenticatedUser = this.authenticationService.requestContaAutenticada();
  }
}
