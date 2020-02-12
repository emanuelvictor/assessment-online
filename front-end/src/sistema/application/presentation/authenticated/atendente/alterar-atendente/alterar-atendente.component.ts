import {Component, OnInit} from '@angular/core';

import {textMasks} from '../../../controls/text-masks/text-masks';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@src/sistema/domain/service/authentication.service';
import {UsuarioService} from '@src/sistema/domain/service/usuario.service';
import {Usuario} from '@src/sistema/domain/entity/usuario/usuario.model';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';
import {TdLoadingService} from "@covalent/core/loading";

/**
 *
 */
@Component({
  selector: 'alterar-atendente',
  templateUrl: './alterar-atendente.component.html',
  styleUrls: ['./alterar-atendente.component.css']
})
export class AlterarAtendenteComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Usuario}
   */
  atendente: Usuario = new Usuario();

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} toastService
   * @param {AuthenticationService} authenticationService
   * @param {ActivatedRoute} activatedRoute
   * @param {UsuarioService} usuarioService
   * @param {TdLoadingService} _loadingService
   */
  constructor(public router: Router, public toastService: ToastService,
              public usuarioService: UsuarioService, private _loadingService: TdLoadingService,
              public authenticationService: AuthenticationService, public activatedRoute: ActivatedRoute) {
  }

  /**
   *
   */
  ngOnInit() {
    const atendenteId: number = this.activatedRoute.snapshot.params['id'];
    this.find(atendenteId);
  }

  /**
   *
   * @param {number} id
   */
  public find(id: number) {
    this.usuarioService.findById(id).subscribe(atendente => this.atendente = atendente)
  }

  /**
   *
   * @param atendente
   */
  public update(atendente): void {
    this._loadingService.register('overlayStarSyntax');
    this.usuarioService.save(atendente).then(result => {
      atendente = result;
      this._loadingService.resolve('overlayStarSyntax');
      this.success('Item Avaliável alterado com sucesso')
    })
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute})
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.toastService.open(message, 'Fechar', {
      duration: 5000
    })
  }
}
