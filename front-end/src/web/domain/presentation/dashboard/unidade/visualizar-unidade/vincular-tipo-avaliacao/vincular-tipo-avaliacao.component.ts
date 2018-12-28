import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {TipoAvaliacaoRepository} from "../../../../../repositories/tipo-avaliacao.repository";
import {UnidadeTipoAvaliacao} from "../../../../../entity/avaliacao/unidade-tipo-avaliacao.model";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../repositories/unidade-tipo-avaliacao.repository";
import {TipoAvaliacao} from "../../../../../entity/avaliacao/tipo-avaliacao.model";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'vincular-tipo-avaliacao',
  templateUrl: './vincular-tipo-avaliacao.component.html',
  styleUrls: ['./vincular-tipo-avaliacao.component.css']
})
export class VincularTipoAvaliacaoComponent implements OnInit {
  /**
   *
   */
  public tipoAvaliacao: TipoAvaliacao = new TipoAvaliacao();

  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi'
  ];

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
   */
  @Output()
  public save: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    this.unidadesTiposAvaliacoes = [];
    for (let i = 0; i < this.tiposAvaliacoes.length; i++)
      this.unidadesTiposAvaliacoes.push({
        vinculo: null,
        tipoAvaliacao: this.tiposAvaliacoes[i],
        unidade: this.unidade
      });

    if (this.unidade.id)
      this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: this.unidade.id}).subscribe(page => {
        const result = page.content;

        if (result.length)
          for (let i = 0; i < this.unidadesTiposAvaliacoes.length; i++)
            for (let k = 0; k < result.length; k++)
              if (result[k].unidade.id === this.unidadesTiposAvaliacoes[i].unidade.id) {
                const unidadeTemp = this.unidadesTiposAvaliacoes[i].unidade;
                this.unidadesTiposAvaliacoes[i] = result[k];
                this.unidadesTiposAvaliacoes[i].unidade = unidadeTemp;
              }
      });
  }

  /**
   *
   * @param event
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.unidadesTiposAvaliacoes, event.previousIndex, event.currentIndex);
  }

  /**
   *
   * @param {UnidadeTipoAvaliacao} unidadeTipoAvaliacao
   */
  public saveUnidadeTipoAvaliacao(unidadeTipoAvaliacao: UnidadeTipoAvaliacao = new UnidadeTipoAvaliacao()): void {
    (unidadeTipoAvaliacao as any).selected = true;

    setInterval(function () {
      (unidadeTipoAvaliacao as any).selected = false
    }, 3000);

    this.save.emit(unidadeTipoAvaliacao);
  }
}
