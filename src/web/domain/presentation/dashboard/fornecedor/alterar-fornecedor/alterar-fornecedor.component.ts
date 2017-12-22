import {Component, OnInit} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "../../../../service/authentication.service";
import {UsuarioService} from "../../../../service/usuario.service";
import {Usuario} from "../../../../entity/usuario/usuario.model";


/**
 *
 */
@Component({
  selector: 'alterar-fornecedor',
  templateUrl: './alterar-fornecedor.component.html',
  styleUrls: ['./alterar-fornecedor.component.css']
})
export class AlterarFornecedorComponent implements OnInit {

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
   * @param activatedRoute
   * @param router
   * @param snackBar
   * @param authenticatedUserService
   */
  constructor(public router: Router, public snackBar: MatSnackBar,
              public authenticationService: AuthenticationService, public activatedRoute: ActivatedRoute, public usuarioService: UsuarioService) {
  }

  /**
   *
   */
  ngOnInit() {
    let usuarioId: number = this.activatedRoute.snapshot.params['id'];
    this.find(usuarioId);
  }

  /**
   *
   * @param usuarioId
   */
  public find(usuarioId: number) {
    this.usuarioService.findOne(usuarioId)
      .then((result) => {
        this.usuario = result;
        this.usuarioService
          .findAreasAtuacao(this.usuario.id, null, null)
          .then((result) => {
            this.usuario.areasAtuacao = result.content;
          })
      });
  }

  /**
   *
   */
  public update(usuario): void {
    this.usuarioService.update(usuario)
      .then((usuarioResult) => {
        this.usuarioService.saveAreasAtuacao(usuarioResult.id, usuario.areasAtuacao)
          .then((result) => {
            this.success('Fornecedor alterado com sucesso');
            usuario = usuarioResult;
            usuario.areasAtuacao = result;
          })
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
  public error(message: string) {
    this.openSnackBar(message);
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
