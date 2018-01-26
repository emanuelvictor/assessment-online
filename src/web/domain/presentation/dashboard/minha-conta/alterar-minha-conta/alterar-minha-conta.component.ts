import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {AuthenticationService} from "../../../../service/authentication.service";
import {UsuarioService} from "../../../../service/usuario.service";
import {Usuario} from '../../../../entity/usuario/usuario.model';

@Component({
  selector: 'alterar-minha-conta',
  templateUrl: './alterar-minha-conta.component.html',
  styleUrls: ['./alterar-minha-conta.component.css']
})
export class AlterarMinhaContaComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Usuario}
   */
  usuario: Usuario = new Usuario();

  /**
   *
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {AuthenticationService} authenticationService
   * @param {UsuarioService} usuarioService
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(public router: Router, public snackBar: MatSnackBar, public authenticationService: AuthenticationService, public usuarioService: UsuarioService, public activatedRoute: ActivatedRoute) {
  }

  /**
   *
   */
  ngOnInit() {
    this.getAuthenticatedUser();
  }

  /**
   *
   */
  public getAuthenticatedUser() {
    // this.authenticationService.getPromiseAuthenticatedUser().then(result => {
    //   this.usuario = result;
    // });
  }

  /**
   *
   */
  public update(usuario): void {
    this.usuarioService.update(usuario.key, usuario)
      .then((usuarioResult) => {
        usuario = usuarioResult;
        this.success('Conta alterada com sucesso');
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
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}