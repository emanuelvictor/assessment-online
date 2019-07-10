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
  constructor(private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private dispositivoRepository: DispositivoRepository, private dialog: MatDialog,
              private snackBar: MatSnackBar, public activatedRoute: ActivatedRoute, private router: Router,
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
    this.dispositivoRepository.findById(dispositivoId)
      .subscribe((dispositivo: Dispositivo) => {
        this.dispositivo = dispositivo;

        // this.unidadeRepository.listLightByFilters({
        //   withAvaliaveisFilter: true,
        //   withUnidadesTiposAvaliacoesAtivasFilter: true
        // }).subscribe(result => {
        //   this.unidades = result.content;
        //
        //   for (let k = 0; k < this.unidades.length; k++) {
        //
        //     this.unidadeTipoAvaliacaoRepository.listByUnidadeId({unidadeId: this.unidades[k].id, ativo: true})
        //       .subscribe(resulted => {
        //
        //         this.unidades[k].unidadesTiposAvaliacoes = resulted.content;
        //
        //         if (this.unidadesTiposAvaliacoesDispositivo && this.unidadesTiposAvaliacoesDispositivo.length)
        //           for (let i = 0; i < this.unidadesTiposAvaliacoesDispositivo.length; i++) {
        //             if (this.unidades[k].id === this.unidadesTiposAvaliacoesDispositivo[i].unidadeTipoAvaliacao.unidade.id) {
        //               this.unidades[k].unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao => {
        //                 if (unidadeTipoAvaliacao.id === this.unidadesTiposAvaliacoesDispositivo[i].unidadeTipoAvaliacao.id) {
        //                   this.unidades[k].checked = true;
        //                   unidadeTipoAvaliacao.checked = true;
        //                 }
        //               })
        //             }
        //           }
        //       })
        //   }
        // })
      });
  }

  /**
   *
   */
  public remove() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Isso vai remover também todas as avaliações realizadas para este tipo de avaliação, incluindo as vinculadas á itens avaliáveis. Deseja realmente prosseguir?',
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
    this.dispositivo.unidadesTiposAvaliacoesDispositivo.push($event);
    this.unidadeTipoAvaliacaoDispositivoRepository.save($event)
  }

  /**
   *
   * @param $event
   */
  removeUnidadeTipoAvaliacaoDispositivo($event: any) {
    for (let i = 0; i < this.dispositivo.unidadesTiposAvaliacoesDispositivo.length; i++) {
      if (this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].unidadeTipoAvaliacao.id === $event.unidadeTipoAvaliacao.id)
        this.dispositivo.unidadesTiposAvaliacoesDispositivo.splice(i, 1);
    }
    this.unidadeTipoAvaliacaoDispositivoRepository.delete($event.id)
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
