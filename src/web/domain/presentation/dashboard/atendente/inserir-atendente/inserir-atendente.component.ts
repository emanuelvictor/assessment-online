import {Component, OnInit} from '@angular/core';
import {UsuarioService} from '../../../../service/usuario.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {Usuario} from '../../../../entity/usuario/Usuario.model';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'inserir-atendente',
  templateUrl: './inserir-atendente.component.html',
  styleUrls: ['./inserir-atendente.component.css']
})
export class InserirAtendenteComponent implements OnInit {
  /**
   *
   * @type {Usuario}
   */
  atendente: Usuario = new Usuario();

  /**
   *
   * @param {UsuarioService} usuarioService
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   * @param {Title} title
   */
  constructor(public usuarioService: UsuarioService, public router: Router, public snackBar: MatSnackBar, public activatedRoute: ActivatedRoute, private title: Title) {
  }

  /**
   *
   */
  ngOnInit() {
    this.title.setTitle('Inserir atendente');
  }

  /**
   *
   */
  public save(): void {
    console.log(this.atendente);
    this.usuarioService.save(this.atendente).then(result => {
      this.atendente = result;
      this.success('Atendente inserido com sucesso');
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
