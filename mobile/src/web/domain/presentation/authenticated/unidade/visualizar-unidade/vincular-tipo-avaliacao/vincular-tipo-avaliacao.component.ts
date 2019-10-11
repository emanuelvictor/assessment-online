import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Unidade} from '../../../../../entity/unidade/unidade.model';
import {viewAnimation} from '../../../../controls/utils';

@Component({
  selector: 'vincular-tipo-avaliacao',
  templateUrl: './vincular-tipo-avaliacao.component.html',
  styleUrls: ['./vincular-tipo-avaliacao.component.css'],
  animations: [
    viewAnimation
  ]
})
export class VincularTipoAvaliacaoComponent {

  /**
   *
   */
  @Input()
  public tiposAvaliacoes: any;

  /**
   *
   * @type {EventEmitter<any>}
   */
  @Output()
  public tiposAvaliacoesChange = new EventEmitter();

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
   * @type {EventEmitter<any>}
   */
  @Output()
  public saveUnidadeTipoAvaliacao = new EventEmitter();

  /**
   *
   * @param tipoAvaliacao
   */
  public saveUnidadeTipoAvaliacaoInner(tipoAvaliacao): void {
    this.saveUnidadeTipoAvaliacao.emit(tipoAvaliacao);
  }

}
