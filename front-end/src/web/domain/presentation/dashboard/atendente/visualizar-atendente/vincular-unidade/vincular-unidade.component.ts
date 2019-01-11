import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Usuario} from '../../../../../entity/usuario/usuario.model';
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {OperadorRepository} from "../../../../../repositories/operador.repository";
import {Operador} from "../../../../../entity/usuario/vinculo/operador.model";
import {AvaliavelRepository} from "../../../../../repositories/avaliavel.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../../repositories/unidade-tipo-avaliacao.repository";
import {Avaliavel} from "../../../../../entity/usuario/vinculo/avaliavel.model";

@Component({
  selector: 'vincular-unidade',
  templateUrl: './vincular-unidade.component.html',
  styleUrls: ['./vincular-unidade.component.scss']
})
export class VincularUnidadeComponent implements OnInit {

  /**
   *
   */
  @Input()
  public unidades: any;

  /**
   *
   * @type {Unidade}
   */
  @Input()
  public filter: any = {
    unidade: {}
  };

  /**
   *
   */
  @Input()
  usuario: Usuario;

  /**
   *
   */
  @Output()
  saveOperador: EventEmitter<any> = new EventEmitter();

  /**
   *
   */
  @Output()
  removeOperador: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @param {OperadorRepository} operadorRepository
   * @param {AvaliavelRepository} avaliavelRepository
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(private operadorRepository: OperadorRepository,
              private avaliavelRepository: AvaliavelRepository,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {
  }

  /**
   *
   */
  ngOnInit() {

    if (this.usuario.id) {
      this.operadorRepository.listByFilters({usuarioId: this.usuario.id}).subscribe(page => {
        const result = page.content;
        if (result.length)
          for (let i = 0; i < this.unidades.length; i++)
            for (let k = 0; k < result.length; k++)
              if (result[k].unidade.id === this.unidades[i].id) {
                this.unidades[i].operadorValue = true;
                this.unidades[i].operador = result[k];
              }
      });

      this.avaliavelRepository.listByFilters({usuarioId: this.usuario.id}).subscribe(page => {
        const result = page.content;
        if (result.length)
          for (let i = 0; i < this.unidades.length; i++)
            for (let k = 0; k < result.length; k++)
              if (result[k].unidadeTipoAvaliacao.unidade.id === this.unidades[i].id) {
                if (result[k].ativo)
                  this.unidades[i].avaliavelValue = true;
                if (!this.unidades[i].avaliaveis)
                  this.unidades[i].avaliaveis = [];
                this.unidades[i].avaliaveis.push(result[k]);
              }
      });
    }

  }

  /**
   *
   * @param {Unidade} unidade
   */
  public saveOperadorInner(unidade: Unidade): void {

    const operador: Operador = new Operador();
    operador.usuario = this.usuario;
    operador.unidade = unidade;

    if (!(unidade as any).operadorValue)
      this.removeOperador.emit((unidade as any).operador);
    else
      this.saveOperador.emit(operador)

  }

  /**
   *
   * @param unidade
   */
  public changeAvaliavel(unidade) {
    if (unidade.avaliavelValue)
      this.listTiposAvaliacoesByUnidadeId(unidade);
  }

  /**
   *
   * @param {Unidade} unidade
   */
  public listTiposAvaliacoesByUnidadeId(unidade) {
    this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: unidade.id, ativo: true})
      .subscribe(page => {
          unidade.unidadesTiposAvaliacoes = page.content;
          for (let k = 0; k < unidade.unidadesTiposAvaliacoes.length; k++) {
            if (unidade.avaliaveis)
              for (let i = 0; i < unidade.avaliaveis.length; i++) {
                if (unidade.avaliaveis[i].unidadeTipoAvaliacao.tipoAvaliacao.id === unidade.unidadesTiposAvaliacoes[k].tipoAvaliacao.id)
                  unidade.unidadesTiposAvaliacoes[k].checked = unidade.avaliaveis[i].ativo;
              }
          }
        }
      );
  }

  /**
   *
   * @param unidade
   * @param unidadeTipoAvaliacao
   */
  public changeUnidadeTipoAvaliacao(unidade, unidadeTipoAvaliacao) {

    const avaliavel: Avaliavel = new Avaliavel();
    avaliavel.usuario = this.usuario;
    avaliavel.unidadeTipoAvaliacao = unidadeTipoAvaliacao;

    if (unidade.avaliaveis)
      for (let k = 0; k < unidade.avaliaveis.length; k++) {
        if (unidade.avaliaveis[k].unidadeTipoAvaliacao.id === unidadeTipoAvaliacao.id) {
          avaliavel.id = unidade.avaliaveis[k].id;
          unidade.avaliaveis[k].ativo = !unidade.avaliaveis[k].ativo;
          avaliavel.ativo = unidade.avaliaveis[k].ativo;
        }
      }

    this.avaliavelRepository.save(avaliavel)
      .then(result => {
        if (unidade.avaliaveis) {
          for (let k = 0; k < unidade.avaliaveis.length; k++) {
            if (unidade.avaliaveis[k].id === result.id){
              unidade.avaliaveis[k] = result;
              break;
            }
            if (k === unidade.avaliaveis.length -1)
              unidade.avaliaveis.push(result);
          }
        }
        else {
          unidade.avaliaveis = [];
          unidade.avaliaveis.push(result)
        }
      });
  }

}
