import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {AvaliacaoService} from '../../../../../service/avaliacao.service';
import {textMasks} from '../../../../controls/text-masks/text-masks';
import * as moment from 'moment';
import {TdDigitsPipe, TdFadeInOutAnimation} from '@covalent/core';
import {UsuarioService} from '../../../../../service/usuario.service';
import {Avaliacao} from '../../../../../entity/avaliacao/Avaliacao.model';

@Component({
  selector: 'estatisticas-atendente',
  templateUrl: './estatisticas-atendente.component.html',
  styleUrls: ['./estatisticas-atendente.component.scss']
})
export class EstatisticasAtendenteComponent implements OnInit {

  /**
   *
   */
  avaliacoes: Avaliacao[];


  /**
   *
   */
  atendente: any;

  /**
   *
   * @type {boolean}
   */
  loaded = false;

  /**
   *
   * @param {UsuarioService} usuarioService
   * @param {AvaliacaoService} avaliacaoService
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(private usuarioService: UsuarioService, private avaliacaoService: AvaliacaoService, public activatedRoute: ActivatedRoute) {
  }

  /**
   *
   */
  ngOnInit() {
    this.usuarioService.findOne(this.activatedRoute.snapshot.params['key'])
      .subscribe(atendente => {
        this.atendente = atendente;

        /**
         * Filtra as avaliações
         */
        this.avaliacaoService.listAvaliacoesByAtendenteKey(this.atendente.key)
          .subscribe(avaliacoes => {

            this.loaded = true;

            this.avaliacoes = avaliacoes;
          })
      });
  }
}