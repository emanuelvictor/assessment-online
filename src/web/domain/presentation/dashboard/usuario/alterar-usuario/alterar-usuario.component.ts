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
  selector: 'alterar-usuario',
  templateUrl: './alterar-usuario.component.html',
  styleUrls: ['./alterar-usuario.component.css']
})
export class AlterarUsuarioComponent implements OnInit {

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
   * @param {ActivatedRoute} activatedRoute
   * @param {UsuarioService} usuarioService
   */
  constructor(public router: Router, public snackBar: MatSnackBar,
              public authenticationService: AuthenticationService, public activatedRoute: ActivatedRoute,
              public usuarioService: UsuarioService) {
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
      });
  }

  /**
   *
   */
  public update(usuario): void {
    this.usuarioService.update(usuario).then((result) => {
      usuario = result;
      this.success('Usuário alterado com sucesso');
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
