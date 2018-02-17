import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AvaliacaoService} from '../AvaliacaoService';
import {MatSnackBar} from '@angular/material';
import {AtendenteService} from "../../../../../web/domain/service/atendente.service";
import {UsuarioService} from "../../../../../web/domain/service/usuario.service";

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
   * @param {AtendenteService} atendenteService
   * @param {UsuarioService} usuarioService
   * @param {MatSnackBar} snackBar
   */
  constructor(private router: Router, private avaliacaoService: AvaliacaoService, private atendenteService: AtendenteService, private usuarioService: UsuarioService, private snackBar: MatSnackBar) {
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
    this.atendentes.forEach(atendente => {
      if (atendente.selected) {
        this.avaliacaoService.addAtendente(atendente);
      }
    });

    /**
     *
     */
    if (this.avaliacaoService.getAtendentes().length > 0) {
      this.avaliacaoService.enviarAvaliacao();
      this.router.navigate(['conclusao']);
    } else {
      this.snackBar.open('Selecione ao menos um atendente', 'Fechar');
    }
  }
}
