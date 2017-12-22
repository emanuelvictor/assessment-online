import {Component, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {MatSnackBar} from "@angular/material";
import 'rxjs/add/operator/toPromise';
import {textMasks} from "../../../../../application/controls/text-masks/text-masks";
import {ActivatedRoute, Router} from "@angular/router";
import {Usuario} from "../../../../entity/usuario/usuario.model";
import {UsuarioService} from "../../../../service/usuario.service";


/**
 *
 */
@Component({
  selector: 'inserir-fornecedor',
  templateUrl: './inserir-fornecedor.component.html',
  styleUrls: ['./inserir-fornecedor.component.css']
})
export class InserirFornecedorComponent implements OnInit {

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
   */
  constructor(public usuarioService: UsuarioService, public router: Router, public http: Http, public snackBar: MatSnackBar, public activatedRoute: ActivatedRoute) {
  }

  /**
   *
   */
  ngOnInit() {
    this.usuario.perfil = 'FORNECEDOR';
    this.usuario.souEmpresa = true;
  }

  /**
   *
   */
  public save(usuario): void {
    this.usuarioService.save(usuario).then(usuarioResult => {
      this.usuarioService.saveAreasAtuacao(usuarioResult.id, usuario.areasAtuacao)
        .then((result) => {
          usuario = usuarioResult;
          usuario.areasAtuacao = result;
          this.success('Fornecedor inserido com sucesso');
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
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}
