import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material';
// import 'rxjs/add/operator/toPromise';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {Router} from '@angular/router';
import {Unidade} from '../../../../../domain/entity/unidade/unidade.model';
import {UnidadeService} from '../../../../../domain/service/unidade.service';
import {TipoAvaliacaoRepository} from '../../../../../domain/repository/tipo-avaliacao.repository';
import {UnidadeTipoAvaliacao} from '../../../../../domain/entity/avaliacao/unidade-tipo-avaliacao.model';
import {UnidadeTipoAvaliacaoRepository} from '../../../../../domain/repository/unidade-tipo-avaliacao.repository';


/**
 *
 */
@Component({
  selector: 'inserir-unidade',
  templateUrl: './inserir-unidade.component.html',
  styleUrls: ['./inserir-unidade.component.scss']
})
export class InserirUnidadeComponent {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Unidade}
   */
  unidade: Unidade = new Unidade();

  /**
   *
   * @type {Array}
   */
  public unidadesTiposAvaliacoes = [];

  /**
   *
   */
  public tiposAvaliacoes: any;

  /**
   *
   * @param {UnidadeService} unidadeService
   * @param {Router} router
   * @param {MatSnackBar} snackBar
   * @param {TipoAvaliacaoRepository} tipoAvaliacaoRepository
   * @param {UnidadeTipoAvaliacaoRepository} unidadeTipoAvaliacaoRepository
   */
  constructor(private unidadeService: UnidadeService,
              private router: Router, private  snackBar: MatSnackBar,
              private tipoAvaliacaoRepository: TipoAvaliacaoRepository,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {

    this.tipoAvaliacaoRepository.listByFilters(null)
      .subscribe(result => {
        this.tiposAvaliacoes = result.content;
        if (this.tiposAvaliacoes.length && this.tiposAvaliacoes.length === 1) {
          this.tiposAvaliacoes[0].ativo = true;
          this.saveUnidadeTipoAvaliacao(this.tiposAvaliacoes[0])
        }
      })
  }

  /**
   *
   */
  public save(unidade): void {
    const test = this.unidadesTiposAvaliacoes.filter(unidadeTipoAvaliacao => unidadeTipoAvaliacao.ativo);
    if (!test || !test.length) {
      this.openSnackBar('Selecione ao menos uma avaliação');
      return
    }

    this.unidadeService.save(unidade).then(saved => {

      this.unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao => {

        unidadeTipoAvaliacao.unidade = saved;

        if (unidadeTipoAvaliacao.ativo) {
          this.unidadeTipoAvaliacaoRepository.save(unidadeTipoAvaliacao)
        }

      });

      this.success('Unidade inserido com sucesso')
    })
  }

  /**
   *
   * @param tipoAvaliacao
   */
  public saveUnidadeTipoAvaliacao(tipoAvaliacao): void {

    const unidadeTipoAvaliacao: UnidadeTipoAvaliacao = new UnidadeTipoAvaliacao();
    unidadeTipoAvaliacao.tipoAvaliacao = tipoAvaliacao;
    unidadeTipoAvaliacao.unidade = this.unidade;
    unidadeTipoAvaliacao.ativo = tipoAvaliacao.ativo;

    for (let i = 0; i < this.unidadesTiposAvaliacoes.length; i++) {
      if (this.unidadesTiposAvaliacoes[i].tipoAvaliacao.id === unidadeTipoAvaliacao.tipoAvaliacao.id) {
        this.unidadesTiposAvaliacoes[i] = unidadeTipoAvaliacao;
        return
      }
    }

    this.unidadesTiposAvaliacoes.push(unidadeTipoAvaliacao)
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['/authenticated/unidades']);
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message);
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
