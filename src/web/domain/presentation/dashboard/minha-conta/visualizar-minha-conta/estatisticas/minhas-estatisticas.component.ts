import {Component, OnInit} from '@angular/core';
import {AvaliacaoService} from '../../../../../service/avaliacao.service';
import {UsuarioService} from '../../../../../service/usuario.service';
import {Avaliacao} from '../../../../../entity/avaliacao/Avaliacao.model';

@Component({
  selector: 'minhas-estatisticas',
  templateUrl: './minhas-estatisticas.component.html',
  styleUrls: ['./minhas-estatisticas.component.scss']
})
export class MinhasEstatisticasComponent implements OnInit {

  /**
   *
   */
  avaliacoes: Avaliacao[];

  /**
   *
   */
  usuarioLogado: any;


  /**
   * @param {AvaliacaoService} avaliacaoService
   * @param {UsuarioService} usuarioService
   */
  constructor(private avaliacaoService: AvaliacaoService, private usuarioService: UsuarioService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.usuarioService.getUsuarioAutenticado()
      .subscribe(usuarioLogado => {
        this.usuarioLogado = usuarioLogado;

        /**
         * Filtra as avaliações
         */
        this.avaliacaoService.listAvaliacoesByAtendenteKey(this.usuarioLogado.key)
          .subscribe(avaliacoes => {
            this.avaliacoes = avaliacoes;
          })
      });
  }

}
