import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {UnidadeTipoAvaliacao} from "../../../../../entity/avaliacao/unidade-tipo-avaliacao.model";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../repositories/unidade-tipo-avaliacao.repository";
import {TipoAvaliacao} from "../../../../../entity/avaliacao/tipo-avaliacao.model";
import {viewAnimation} from "../../../../controls/utils";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'vincular-tipo-avaliacao',
  templateUrl: './vincular-tipo-avaliacao.component.html',
  styleUrls: ['./vincular-tipo-avaliacao.component.css'],
  animations: [
    viewAnimation
  ]
})
export class VincularTipoAvaliacaoComponent implements OnInit {

  /**
   *
   */
  public tipoAvaliacao: TipoAvaliacao = new TipoAvaliacao();

  /**
   *
   */
  @Input()
  public tiposAvaliacoes: any;

  /**
   *
   * @type {Unidade}
   */
  @Input()
  public filter: any = {
    nome: null,
    enunciado: null
  };

  /**
   *
   * @type {Array}
   */
  public unidadesTiposAvaliacoes = [];

  /**
   *
   */
  @Input()
  public unidade: Unidade;

  /**
   *
   * @type {boolean}
   */
  public done: boolean = false;

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(private snackBar: MatSnackBar,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    this.unidadesTiposAvaliacoes = [];
    for (let i = 0; i < this.tiposAvaliacoes.length; i++)
      this.unidadesTiposAvaliacoes.push({
        ativo: false,
        tipoAvaliacao: this.tiposAvaliacoes[i],
        unidade: this.unidade
      });

    if (this.unidade.id)
      this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: this.unidade.id}).subscribe(page => {
        const result = page.content;

        if (result.length) {
          for (let i = 0; i < this.unidadesTiposAvaliacoes.length; i++)
            for (let k = 0; k < result.length; k++)
              if (result[k].tipoAvaliacao.id === this.unidadesTiposAvaliacoes[i].tipoAvaliacao.id)
                this.unidadesTiposAvaliacoes[i] = result[k];
        }

        this.done = true;
      });
  }

  /**
   *
   * @param {UnidadeTipoAvaliacao} unidadeTipoAvaliacao
   */
  public saveUnidadeTipoAvaliacao(unidadeTipoAvaliacao): void {
    this.unidadeTipoAvaliacaoRepository.save(unidadeTipoAvaliacao)
      .then(result => {
        for (let i = 0; i < this.unidadesTiposAvaliacoes.length; i++)
          if (unidadeTipoAvaliacao.tipoAvaliacao.id === this.unidadesTiposAvaliacoes[i].tipoAvaliacao.id)
            this.unidadesTiposAvaliacoes[i] = result;
      });
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
