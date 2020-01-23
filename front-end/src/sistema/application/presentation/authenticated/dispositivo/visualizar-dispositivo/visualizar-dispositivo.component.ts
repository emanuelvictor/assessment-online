import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Avaliacao} from '@src/sistema/domain/entity/avaliacao/avaliacao.model';
import {Dispositivo} from '@src/sistema/domain/entity/avaliacao/dispositivo.model';
import {DispositivoRepository} from '@src/sistema/domain/repository/dispositivo.repository';
import {ConfirmDialogComponent} from '../../../controls/confirm-dialog/confirm-dialog.component';
import {UnidadeTipoAvaliacaoDispositivoRepository} from '@src/sistema/domain/repository/unidade-tipo-avaliacao-dispositivo.repository';
import {viewAnimation} from '../../../controls/utils';
import {UnidadeRepository} from '@src/sistema/domain/repository/unidade.repository';
import {UnidadeTipoAvaliacaoRepository} from '@src/sistema/domain/repository/unidade-tipo-avaliacao.repository';
import {UnidadeTipoAvaliacaoDispositivo} from '@src/sistema/domain/entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model';
import {WebSocketSubject} from 'rxjs/webSocket';
import * as moment from 'moment';
import 'moment/locale/pt-br'
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';

@Component({
  selector: 'visualizar-dispositivo',
  templateUrl: './visualizar-dispositivo.component.html',
  styleUrls: ['./visualizar-dispositivo.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class VisualizarDispositivoComponent implements OnInit {

  /**
   *
   * @type {Avaliacao}
   */
  dispositivoToCode: Dispositivo = new Dispositivo();

  /**
   *
   */
  path: any;

  /**
   *
   * @type {Avaliacao}
   */
  dispositivo: Dispositivo = new Dispositivo();

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
   * @type {{unidade: {}}}
   */
  public filter: any = {
    unidade: {}
  };

  /**
   *
   */
  private webSocketSubject: WebSocketSubject<Dispositivo>;

  /**
   *
   * @param unidadeRepository
   * @param unidadeTipoAvaliacaoRepository
   * @param toastService {MatSnackBar}
   * @param activatedRoute {ActivatedRoute}
   * @param router {Router}
   * @param dialog {MatDialog}
   * @param dispositivoRepository {DispositivoRepository}
   * @param unidadeTipoAvaliacaoDispositivoRepository
   */
  constructor(private unidadeRepository: UnidadeRepository,
              private router: Router, private dialog: MatDialog,
              private dispositivoRepository: DispositivoRepository,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private toastService: ToastService, public activatedRoute: ActivatedRoute,
              private unidadeTipoAvaliacaoDispositivoRepository: UnidadeTipoAvaliacaoDispositivoRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    const id: number = this.activatedRoute.snapshot.params['id'];
    this.find(id)
  }

  /**
   *
   * @param {number} id
   */
  public find(id: number) {

    this.webSocketSubject = this.dispositivoRepository.ws(id);

    this.webSocketSubject.subscribe(dispositivo => {
      this.dispositivoToCode = dispositivo;
      this.path = 'dispositivos/' + this.dispositivoToCode.id + '/qrcode' + '?nocache=' + Math.floor(Math.random() * 2000).toString();
    });

    this.dispositivoRepository.findById(id).subscribe(dispositivo => {
      this.unidadeRepository.listLightByFilters({withUnidadesTiposAvaliacoesAtivasFilter: true}).subscribe(pagee => {

        this.unidades = pagee.content;

        this.unidadeTipoAvaliacaoDispositivoRepository.listByFilters({dispositivoId: dispositivo.id}).subscribe(page => {
          dispositivo.unidadesTiposAvaliacoesDispositivo = page.content;

          for (let i = 0; i < this.unidades.length; i++) {
            this.unidadeTipoAvaliacaoRepository.listByFilters({
              unidadeId: this.unidades[i].id,
              ativo: true
            }).subscribe(result => {

              this.unidades[i].unidadesTiposAvaliacoes = result.content;

              this.vincularUnidadeTipoSvaliacao = this.unidades.length && (this.unidades.length > 1 || (this.unidades.length === 1 && (this.unidades[0].unidadesTiposAvaliacoes && this.unidades[0].unidadesTiposAvaliacoes.length > 1)));

              this.unidades[i].unidadesTiposAvaliacoes.map(unidadeTipoAvaliacao => {
                (unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo(false)
              });

              for (let k = 0; k < dispositivo.unidadesTiposAvaliacoesDispositivo.length; k++) {
                if (dispositivo.unidadesTiposAvaliacoesDispositivo[k].unidadeTipoAvaliacao.unidade.id === this.unidades[i].id) {

                  if (dispositivo.unidadesTiposAvaliacoesDispositivo[k].ativo) {
                    this.unidades[i].unidadeTipoAvaliacaoDispositivoValue = dispositivo.unidadesTiposAvaliacoesDispositivo[k].ativo;
                  }

                  (dispositivo.unidadesTiposAvaliacoesDispositivo[k].unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoDispositivo = dispositivo.unidadesTiposAvaliacoesDispositivo[k];

                  for (let j = 0; j < this.unidades[i].unidadesTiposAvaliacoes.length; j++) {
                    dispositivo.unidadesTiposAvaliacoesDispositivo.forEach(unidadeTipoAvaliacaoDispositivo => {
                      if (this.unidades[i].unidadesTiposAvaliacoes[j].id === unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id) {
                        this.unidades[i].unidadesTiposAvaliacoes[j] = unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao
                      }
                    })
                  }

                }
              }

              this.dispositivo = dispositivo
            })
          }
        })
      })
    })
  }

  /**
   *
   */
  public remove() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Isso vai remover também todas as avaliações realizadas para este dispositivo, incluindo as vinculadas á itens avaliáveis. Deseja realmente prosseguir?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.dispositivoRepository.delete(this.dispositivo.id)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.toastService.open('Unidade excluído com sucesso', 'Fechar', {
              duration: 3000
            })
          })
      }
    })
  }

  /**
   *
   * @param $event
   */
  public unidadesTiposAvaliacoesDispositivoChange($event) {
    this.dispositivo.unidadesTiposAvaliacoesDispositivo = $event;

    for (let i = 0; i < this.dispositivo.unidadesTiposAvaliacoesDispositivo.length; i++) {
      const aux = new UnidadeTipoAvaliacaoDispositivo();
      aux.id = this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].id;

      aux.unidadeTipoAvaliacao = Object.assign({}, this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].unidadeTipoAvaliacao);
      delete (aux.unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoDispositivo;

      aux.dispositivo = new Dispositivo(this.dispositivo.id);
      aux.id = this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].id;
      aux.ativo = this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].ativo;
      aux.ordem = this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].ordem;

      this.dispositivo.unidadesTiposAvaliacoesDispositivo[i] = aux
    }

    this.dispositivoRepository.saveUnidadesTiposAvaliacoesDispositivo(this.dispositivo.id, this.dispositivo.unidadesTiposAvaliacoesDispositivo)
      .then(result => {
        for (let i = 0; i < this.dispositivo.unidadesTiposAvaliacoesDispositivo.length; i++) {
          for (let k = 0; k < result.length; k++) {
            if (result[k].unidadeTipoAvaliacao.id === this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].unidadeTipoAvaliacao.id) {
              (this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoDispositivo = result[k];
              for (let c = 0; c < this.unidades.length; c++) {
                if (this.unidades[c].id === result[k].unidadeTipoAvaliacao.unidade.id) {
                  for (let j = 0; j < this.unidades[c].unidadesTiposAvaliacoes.length; j++) {
                    if (this.unidades[c].unidadesTiposAvaliacoes[j].id === result[k].unidadeTipoAvaliacao.id) {
                      this.unidades[c].unidadesTiposAvaliacoes[j].unidadeTipoAvaliacaoDispositivo.id = result[k].id
                    }
                  }
                }
              }
            }
          }
        }
      })
  }

  /**
   *
   * @param numeroSerie
   */
  desvincular(numeroSerie: string) {
    this.dispositivoRepository.desvincular(numeroSerie).toPromise().then(() =>
      this.openSnackBar('Desvinculado com sucesso!')
    )
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
    this.toastService.open(message, 'Fechar', {
      duration: 5000
    })
  }

  /**
   *
   */
  updateStatusAtivo(id: number) {
    this.dispositivoRepository.findById(id).subscribe(result => {
      if (result.ativo) {
        const momentt = moment().add(6, 'months').calendar();
        const dialogRef = this.dialog.open(ConfirmDialogComponent,
          {
            data: {
              color: 'red',
              text: 'Você poderá reativar o dispositivo depois de 6 meses (' + momentt + '). Deseja continuar?!',
              confirm: 'Sim',
              cancel: 'Não'
            }
          }
        );

        dialogRef.afterClosed().subscribe(desativar => {
          if (desativar) {
            this.dispositivoRepository.updateStatusAtivo(id).subscribe(resulted => {
              this.dispositivo = resulted;
              this.toastService.open('Dispositivo desativado com sucesso', 'Fechar', {
                duration: 3000
              })
            });
          }
        });
      } else {
        this.dispositivoRepository.updateStatusAtivo(id).subscribe(resulted => {
          this.dispositivo = resulted;
          this.toastService.open('Dispositivo ativado com sucesso', 'Fechar', {
            duration: 3000
          })
        });
      }
    })

  }

  /**
   *
   * @param id
   */
  updateCodigo(id: number) {
    this.dispositivoRepository.updateCodigo(id).subscribe()
  }
}
