import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AvaliacaoService} from '../AvaliacaoService';
import {MatSnackBar} from '@angular/material';
import {UsuarioService} from "../../../../../web/domain/service/usuario.service";
import {ColaboradorService} from "../../../../../web/domain/service/colaborador.service";

@Component({
  selector: 'selecionar-atendentes',
  templateUrl: './selecionar-atendentes.component.html',
  styleUrls: ['./selecionar-atendentes.component.scss']
})
export class SelecionarAtendentesComponent implements OnInit {

  /**
   * @type {Array}
   */
  atendentes: any[] = [];

  /**
   *
   * @param {Router} router
   * @param {AvaliacaoService} avaliacaoService
   * @param {ColaboradorService} colaboradorService
   * @param {UsuarioService} usuarioService
   * @param {MatSnackBar} snackBar
   */
  constructor(private router: Router, private avaliacaoService: AvaliacaoService, private colaboradorService: ColaboradorService, private usuarioService: UsuarioService, private snackBar: MatSnackBar) {
  }

  /**
   *
   */
  ngOnInit() {
    this.usuarioService.find().subscribe(usuarios => {
      this.atendentes = usuarios;
    })
  }

  /**
   *
   */
  public concluir() {
    this.atendentes.forEach(colaborador => {
      if (colaborador.selected) {
        this.avaliacaoService.addColaborador(colaborador);
      }
    });

    /**
     * TODO
     */
    // if (this.avaliacaoService.getAtendentes().length > 0) {
    //   this.avaliacaoService.enviarAvaliacao();
    //   this.router.navigate(['conclusao']);
    // } else {
    //   this.snackBar.open('Selecione ao menos um atendente', 'Fechar');
    // }
  }
}
