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
import {Unidade} from "../../../../entity/unidade/unidade.model";

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

  // unidadesTiposAvaliacoesDispositivo: any[] = [];

  /**
   *
   * @type {{unidade: {}}}
   */
  public filter: any = {
    unidade: {}
  };


  /**
   *
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
      this.dispositivo = dispositivo;

      this.unidadeRepository.listLightByFilters({
        withUnidadesTiposAvaliacoesAtivasFilter: true
      }).subscribe(result => {
        this.unidades = result.content;

        for (let k = 0; k < this.unidades.length; k++) {

          this.unidadeTipoAvaliacaoRepository.listByUnidadeId({unidadeId: this.unidades[k].id, ativo: true})
            .subscribe(resulted => {

              this.unidades[k].unidadesTiposAvaliacoes = resulted.content;

              if (this.dispositivo.unidadesTiposAvaliacoesDispositivo && this.dispositivo.unidadesTiposAvaliacoesDispositivo.length)
                for (let i = 0; i < this.dispositivo.unidadesTiposAvaliacoesDispositivo.length; i++) {
                  if (this.unidades[k].id === this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].unidadeTipoAvaliacao.unidade.id) {
                    this.unidades[k].unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao => {
                      if (unidadeTipoAvaliacao.id === this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].unidadeTipoAvaliacao.id) {
                        this.unidades[k].checked = true;
                        unidadeTipoAvaliacao.checked = this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].ativo
                      }
                    })
                  }
                }
            })
        }
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
  addUnidadeTipoAvaliacaoDispositivo($event: any) {
    console.log($event.id);
    $event.ativo = true;
    // delete $event.unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes;

    const toSave = Object.assign({}, $event);
    console.log(toSave);
    toSave.dispositivo = {id: this.dispositivo.id};
    toSave.unidadeTipoAvaliacao.unidade = Object.assign({}, $event.unidade);
    toSave.unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes = Object.assign([], toSave.unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes);
    toSave.unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao => {
      unidadeTipoAvaliacao.unidade = Object.assign({}, {id: unidadeTipoAvaliacao.unidade.id})
    });
    if (!toSave.id)
      this.dispositivo.unidadesTiposAvaliacoesDispositivo.push(toSave);
    this.unidadeTipoAvaliacaoDispositivoRepository.save(toSave)
  }

  /**
   *
   * @param $event
   */
  removeUnidadeTipoAvaliacaoDispositivo($event: any) {
    console.log($event.id);
    $event.ativo = false;
    // delete $event.unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes;

    const toSave = Object.assign({}, $event);
    toSave.dispositivo = {id: this.dispositivo.id};
    toSave.unidadeTipoAvaliacao.unidade = Object.assign({}, $event.unidade);
    toSave.unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes = Object.assign([], toSave.unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes);
    toSave.unidadeTipoAvaliacao.unidade.unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao => {
      unidadeTipoAvaliacao.unidade = Object.assign({}, {id: unidadeTipoAvaliacao.unidade.id})
    });
    if (!toSave.id)
      this.dispositivo.unidadesTiposAvaliacoesDispositivo.push(toSave);
    this.unidadeTipoAvaliacaoDispositivoRepository.save(toSave)
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
