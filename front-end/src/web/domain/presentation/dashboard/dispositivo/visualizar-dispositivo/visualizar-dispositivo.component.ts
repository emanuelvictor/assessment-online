import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Avaliacao} from "../../../../entity/avaliacao/avaliacao.model";
import {Dispositivo} from "../../../../entity/avaliacao/dispositivo.model";
import {DispositivoRepository} from "../../../../repository/dispositivo.repository";
import {ConfirmDialogComponent} from "../../../controls/confirm-dialog/confirm-dialog.component";
import {UnidadeTipoAvaliacaoDispositivoRepository} from "../../../../repository/unidade-tipo-avaliacao-dispositivo.repository";
import {viewAnimation} from "../../../controls/utils";
import {UnidadeRepository} from "../../../../repository/unidade.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../repository/unidade-tipo-avaliacao.repository";
import {UnidadeTipoAvaliacaoDispositivo} from "../../../../entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model";

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
  dispositivo: Dispositivo = new Dispositivo();

  unidades: any[] = [];

  /**
   *
   * @type {{unidade: {}}}
   */
  public filter: any = {
    unidade: {}
  };

  /**
   *
   * @param unidadeRepository
   * @param unidadeTipoAvaliacaoRepository
   * @param snackBar {MatSnackBar}
   * @param activatedRoute {ActivatedRoute}
   * @param router {Router}
   * @param dialog {MatDialog}
   * @param dispositivoRepository {DispositivoRepository}
   * @param unidadeTipoAvaliacaoDispositivoRepository
   */
  constructor(private unidadeRepository: UnidadeRepository,
              private router: Router, private dialog: MatDialog,
              private dispositivoRepository: DispositivoRepository,
              private snackBar: MatSnackBar, public activatedRoute: ActivatedRoute,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private unidadeTipoAvaliacaoDispositivoRepository: UnidadeTipoAvaliacaoDispositivoRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    const dispositivoId: number = this.activatedRoute.snapshot.params['id'];
    this.find(dispositivoId)
  }

  /**
   *
   * @param {number} dispositivoId
   */
  public find(dispositivoId: number) {

    this.dispositivoRepository.findById(dispositivoId).subscribe((dispositivo: Dispositivo) => {

      this.unidadeRepository.listLightByFilters({withUnidadesTiposAvaliacoesAtivasFilter: true}).subscribe(result => {

        this.unidades = result.content;

        this.unidadeTipoAvaliacaoDispositivoRepository.listByFilters({dispositivoId: dispositivoId}).subscribe(page => {
          dispositivo.unidadesTiposAvaliacoesDispositivo = page.content;

          for (let i = 0; i < this.unidades.length; i++) {
            this.unidadeTipoAvaliacaoRepository.listByUnidadeId({
              unidadeId: this.unidades[i].id,
              ativo: true
            }).subscribe(result => {

              this.unidades[i].unidadesTiposAvaliacoes = result.content;

              this.unidades[i].unidadesTiposAvaliacoes.map(unidadeTipoAvaliacao => {
                (unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoDispositivo = new UnidadeTipoAvaliacaoDispositivo(false)
              });

              for (let k = 0; k < dispositivo.unidadesTiposAvaliacoesDispositivo.length; k++)
                if (dispositivo.unidadesTiposAvaliacoesDispositivo[k].unidadeTipoAvaliacao.unidade.id === this.unidades[i].id) {

                  if (dispositivo.unidadesTiposAvaliacoesDispositivo[k].ativo)
                    this.unidades[i].unidadeTipoAvaliacaoDispositivoValue = dispositivo.unidadesTiposAvaliacoesDispositivo[k].ativo;

                  (dispositivo.unidadesTiposAvaliacoesDispositivo[k].unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoDispositivo = dispositivo.unidadesTiposAvaliacoesDispositivo[k];

                  for (let j = 0; j < this.unidades[i].unidadesTiposAvaliacoes.length; j++) {
                    dispositivo.unidadesTiposAvaliacoesDispositivo.forEach(unidadeTipoAvaliacaoDispositivo => {
                      if (this.unidades[i].unidadesTiposAvaliacoes[j].id === unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao.id)
                        this.unidades[i].unidadesTiposAvaliacoes[j] = unidadeTipoAvaliacaoDispositivo.unidadeTipoAvaliacao
                    })
                  }

                }

              this.dispositivo = dispositivo
            })
          }
        });
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
            this.snackBar.open('Unidade excluído com sucesso', 'Fechar', {
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
        for (let i = 0; i < this.dispositivo.unidadesTiposAvaliacoesDispositivo.length; i++)
          for (let k = 0; k < result.length; k++)
            if (result[k].unidadeTipoAvaliacao.id === this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].unidadeTipoAvaliacao.id) {
              (this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoDispositivo = result[k];
              for (let c = 0; c < this.unidades.length; c++)
                if (this.unidades[c].id === result[k].unidadeTipoAvaliacao.unidade.id)
                  for (let j = 0; j < this.unidades[c].unidadesTiposAvaliacoes.length; j++)
                    if (this.unidades[c].unidadesTiposAvaliacoes[j].id === result[k].unidadeTipoAvaliacao.id)
                      this.unidades[c].unidadesTiposAvaliacoes[j].unidadeTipoAvaliacaoDispositivo.id = result[k].id
            }
      })
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
