/**
 *
 */


import {Component, OnInit} from "@angular/core";
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {Usuario} from "../../../../entity/usuario/usuario.model";
import {UsuarioService} from "../../../../service/usuario.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Http} from "@angular/http";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'inserir-usuario',
  templateUrl: './inserir-usuario.component.html',
  styleUrls: ['./inserir-usuario.component.css']
})
export class InserirUsuarioComponent implements OnInit {

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
   * @param {UsuarioService} usuarioService
   * @param {Router} router
   * @param {Http} http
   * @param {MatSnackBar} snackBar
   * @param {ToastyService} toastyService
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(public usuarioService: UsuarioService, public router: Router, public http: Http, public snackBar: MatSnackBar, public activatedRoute: ActivatedRoute) {
  }

  /**
   *
   */
  ngOnInit() {
    this.usuario.perfil = 'COOPERADOR';
  }

  /**
   *
   */
  public save(): void {
    this.usuarioService.save(this.usuario).then(result => {
      this.usuario = result;
      this.success('Usuário inserido com sucesso');
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
