import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DispositivoRepository} from '@src/sistema/domain/repository/dispositivo.repository';
import {Dispositivo} from '@src/sistema/domain/entity/avaliacao/dispositivo.model';
import {ActivatedRoute, Router} from '@angular/router';
import {viewAnimation} from '../../../controls/utils';
import {UnidadeRepository} from '@src/sistema/domain/repository/unidade.repository';
import {UnidadeTipoAvaliacaoRepository} from '@src/sistema/domain/repository/unidade-tipo-avaliacao.repository';
import {UnidadeTipoAvaliacaoDispositivo} from '@src/sistema/domain/entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model';
import {ConfirmInsertDispositivoDialogComponent} from '@src/sistema/application/presentation/authenticated/dispositivo/inserir-dispositivo/confirm-insert-dispositivo-dialog/confirm-insert-dispositivo-dialog.component';
import {AssinaturaRepository} from '@src/sistema/domain/repository/assinatura.repository';

/**
 *
 */
@Component({
  selector: 'inserir-dispositivo',
  templateUrl: './inserir-dispositivo.component.html',
  styleUrls: ['./inserir-dispositivo.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class InserirDispositivoComponent implements OnInit {

  /**
   *
   */
  public dispositivo: Dispositivo = new Dispositivo();

  /**
   *
   */
  unidades: any[] = [];

  /**
   *
   */
  vincularUnidadeTipoSvaliacao: boolean;

  /**
   *
   * @param unidadeRepository
   * @param {MatSnackBar} snackBar
   * @param assinturaRepository
   * @param {DispositivoRepository} dispositivoRepository
   * @param unidadeTipoAvaliacaoRepository
   * @param dialog
   * @param {Router} router
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(private dispositivoRepository: DispositivoRepository,
              private activatedRoute: ActivatedRoute, private router: Router,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private unidadeRepository: UnidadeRepository, private dialog: MatDialog,
              private assinturaRepository: AssinaturaRepository, private snackBar: MatSnackBar) {
  }

  /**
   *
   */
  ngOnInit(): void {

    this.unidadeRepository.listLightByFilters({
      withUnidadesTiposAvaliacoesAtivasFilter: true
    }).subscribe(result => {
      this.unidades = result.content;

      for (let k = 0; k < this.unidades.length; k++) {

        this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: this.unidades[k].id, ativo: true})
          .subscribe(resulted => {
            this.unidades[k].unidadesTiposAvaliacoes = resulted.content;

            this.unidades[k].unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao => {
              this.unidades[k].unidadeTipoAvaliacaoDispositivoValue = false;
              unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo = {}
            });

            this.vincularUnidadeTipoSvaliacao = this.unidades.length && (this.unidades.length > 1 || (this.unidades.length === 1 && (this.unidades[0].unidadesTiposAvaliacoes && this.unidades[0].unidadesTiposAvaliacoes.length > 1)));

            if (!this.vincularUnidadeTipoSvaliacao) {
              const unidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo();
              unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao = this.unidades[0].unidadesTiposAvaliacoes[0];
              unidadeTipoAvaliacaoDispositivo.ativo = true;
              unidadeTipoAvaliacaoDispositivo.ordem = 1;
              this.dispositivo.unidadesTiposAvaliacoesDispositivo.push(unidadeTipoAvaliacaoDispositivo)
            } else if (this.unidades[k].unidadesTiposAvaliacoes.length > 1) {

              this.unidades[k].unidadeTipoAvaliacaoDispositivoValue = true;
              const unidadesTiposAvaliacoesDispositivo: UnidadeTipoAvaliacaoDispositivo[] = [];
              for (let i = 0; i < this.unidades[k].unidadesTiposAvaliacoes.length; i++) {
                const unidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo();
                unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao = this.unidades[k].unidadesTiposAvaliacoes[i];
                unidadeTipoAvaliacaoDispositivo.ativo = true;
                unidadeTipoAvaliacaoDispositivo.ordem = (i + 1);
                this.unidades[k].unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoDispositivo = unidadeTipoAvaliacaoDispositivo;
                unidadesTiposAvaliacoesDispositivo.push(unidadeTipoAvaliacaoDispositivo)
              }

              this.unidadesTiposAvaliacoesDispositivoChange(unidadesTiposAvaliacoesDispositivo)
            }
          })
      }
    })
  }

  /**
   *
   * @param $event
   */
  public unidadesTiposAvaliacoesDispositivoChange($event) {

    $event.forEach(item => {

      for (let i = 0; i < this.dispositivo.unidadesTiposAvaliacoesDispositivo.length; i++) {
        if (item.unidadeTipoAvaliacao.id === this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].unidadeTipoAvaliacao.id) {
          this.dispositivo.unidadesTiposAvaliacoesDispositivo[i] = item;
          return
        }
      }

      this.dispositivo.unidadesTiposAvaliacoesDispositivo.push(item)
    })
  }

  /**
   *
   */
  public save($event): void {

    this.assinturaRepository.valorMensal.subscribe(valorMensal => {
      const dialogRef = this.dialog.open(ConfirmInsertDispositivoDialogComponent, {
        data: {
          valorMensal: valorMensal,
        }
      });

      dialogRef.afterClosed().subscribe(insert => {
        if (insert) {
          const dispositivo = Object.assign($event, {});

          dispositivo.unidadesTiposAvaliacoesDispositivo = Object.assign($event.unidadesTiposAvaliacoesDispositivo, []);

          dispositivo.unidadesTiposAvaliacoesDispositivo = dispositivo.unidadesTiposAvaliacoesDispositivo.filter(unidadeTipoAvaliacaoDipositivo => unidadeTipoAvaliacaoDipositivo.ativo).map(unidadeTipoAvaliacaoDipositivo => {
            return {
              ativo: unidadeTipoAvaliacaoDipositivo.ativo,
              ordem: unidadeTipoAvaliacaoDipositivo.ordem,
              unidadeTipoAvaliacao: {id: unidadeTipoAvaliacaoDipositivo.unidadeTipoAvaliacao.id}
            }
          });

          dispositivo.unidadesTiposAvaliacoesDispositivo.forEach(unidadeTpoAvaliacaoDispositivo =>
            delete unidadeTpoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade
          );

          if (dispositivo.unidadesTiposAvaliacoesDispositivo.length > 0) {
            this.dispositivoRepository.save(dispositivo).then(result => {
              this.dispositivo = result;
              this.success('Dispositivo inserido com sucesso')
            });
          } else {
            this.openSnackBar('Selecione ao menos um Tipo de Avaliação')
          }
        }
      })
    })
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute})
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message)
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    })
  }
}
