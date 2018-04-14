import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../../service/authentication.service';
import {UsuarioService} from '../../../../service/usuario.service';
import {Usuario} from '../../../../entity/usuario/Usuario.model';
import {TdLoadingService} from "@covalent/core";

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
   * @type {Colaborador}
   */
  atendente: Usuario = new Usuario();

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {AuthenticationService} authenticationService
   * @param {ActivatedRoute} activatedRoute
   * @param {UsuarioService} usuarioService
   * @param {TdLoadingService} _loadingService
   */
  constructor(public router: Router, public snackBar: MatSnackBar,
              public usuarioService: UsuarioService, private _loadingService: TdLoadingService,
              public authenticationService: AuthenticationService, public activatedRoute: ActivatedRoute) {
  }

  /**
   *
   */
  ngOnInit() {
    const atendenteKey: string = this.activatedRoute.snapshot.params['key'];
    this.find(atendenteKey);
  }

  /**1
   *
   * @param {string} atendenteKey
   */
  public find(atendenteKey: string) {
    this.usuarioService.findOne(atendenteKey).subscribe(atendente => this.atendente = atendente)
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
      this.success('Atendente alterado com sucesso');
    })
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
