import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Avaliacao} from "../../../../entity/avaliacao/avaliacao.model";
import {Licenca} from "../../../../entity/avaliacao/licenca.model";
import {LicencaRepository} from "../../../../repository/licenca.repository";
import {ConfirmDialogComponent} from "../../../controls/confirm-dialog/confirm-dialog.component";
import {UnidadeTipoAvaliacaoLicencaRepository} from "../../../../repository/unidade-tipo-avaliacao-licenca.repository";
import {viewAnimation} from "../../../controls/utils";
import {UnidadeRepository} from "../../../../repository/unidade.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../repository/unidade-tipo-avaliacao.repository";
import {UnidadeTipoAvaliacaoLicenca} from "../../../../entity/avaliacao/unidade-tipo-avaliacao-licenca.model";

@Component({
  selector: 'visualizar-licenca',
  templateUrl: './visualizar-licenca.component.html',
  styleUrls: ['./visualizar-licenca.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class VisualizarLicencaComponent implements OnInit {

  /**
   *
   * @type {Avaliacao}
   */
  licenca: Licenca = new Licenca();

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
   * @param unidadeRepository
   * @param unidadeTipoAvaliacaoRepository
   * @param snackBar {MatSnackBar}
   * @param activatedRoute {ActivatedRoute}
   * @param router {Router}
   * @param dialog {MatDialog}
   * @param licencaRepository {LicencaRepository}
   * @param unidadeTipoAvaliacaoLicencaRepository
   */
  constructor(private unidadeRepository: UnidadeRepository,
              private router: Router, private dialog: MatDialog,
              private licencaRepository: LicencaRepository,
              private snackBar: MatSnackBar, public activatedRoute: ActivatedRoute,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private unidadeTipoAvaliacaoLicencaRepository: UnidadeTipoAvaliacaoLicencaRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    const licencaId: number = this.activatedRoute.snapshot.params['id'];
    this.find(licencaId)
  }

  /**
   *
   * @param {number} licencaId
   */
  public find(licencaId: number) {

    this.licencaRepository.findById(licencaId).subscribe((licenca: Licenca) => {
      this.licenca = licenca

      this.unidadeRepository.listLightByFilters({withUnidadesTiposAvaliacoesAtivasFilter: true}).subscribe(result => {

        this.unidades = result.content;

        this.unidadeTipoAvaliacaoLicencaRepository.listByFilters({licencaId: licencaId}).subscribe(page => {
          licenca.unidadesTiposAvaliacoesLicenca = page.content;

          for (let i = 0; i < this.unidades.length; i++) {
            this.unidadeTipoAvaliacaoRepository.listByFilters({
              unidadeId: this.unidades[i].id,
              ativo: true
            }).subscribe(result => {

              this.unidades[i].unidadesTiposAvaliacoes = result.content;

              this.vincularUnidadeTipoSvaliacao = this.unidades.length && (this.unidades.length > 1 || (this.unidades.length === 1 && (this.unidades[0].unidadesTiposAvaliacoes && this.unidades[0].unidadesTiposAvaliacoes.length > 1)));

              this.unidades[i].unidadesTiposAvaliacoes.map(unidadeTipoAvaliacao => {
                (unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoLicenca = new UnidadeTipoAvaliacaoLicenca(false)
              });

              for (let k = 0; k < licenca.unidadesTiposAvaliacoesLicenca.length; k++)
                if (licenca.unidadesTiposAvaliacoesLicenca[k].unidadeTipoAvaliacao.unidade.id === this.unidades[i].id) {

                  if (licenca.unidadesTiposAvaliacoesLicenca[k].ativo)
                    this.unidades[i].unidadeTipoAvaliacaoLicencaValue = licenca.unidadesTiposAvaliacoesLicenca[k].ativo;

                  (licenca.unidadesTiposAvaliacoesLicenca[k].unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoLicenca = licenca.unidadesTiposAvaliacoesLicenca[k];

                  for (let j = 0; j < this.unidades[i].unidadesTiposAvaliacoes.length; j++) {
                    licenca.unidadesTiposAvaliacoesLicenca.forEach(unidadeTipoAvaliacaoLicenca => {
                      if (this.unidades[i].unidadesTiposAvaliacoes[j].id === unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao.id)
                        this.unidades[i].unidadesTiposAvaliacoes[j] = unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao
                    })
                  }

                }

              this.licenca = licenca
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
          text: 'Isso vai remover também todas as avaliações realizadas para este licenca, incluindo as vinculadas á itens avaliáveis. Deseja realmente prosseguir?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.licencaRepository.delete(this.licenca.id)
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
  public unidadesTiposAvaliacoesLicencaChange($event) {
    this.licenca.unidadesTiposAvaliacoesLicenca = $event;

    for (let i = 0; i < this.licenca.unidadesTiposAvaliacoesLicenca.length; i++) {
      const aux = new UnidadeTipoAvaliacaoLicenca();
      aux.id = this.licenca.unidadesTiposAvaliacoesLicenca[i].id;

      aux.unidadeTipoAvaliacao = Object.assign({}, this.licenca.unidadesTiposAvaliacoesLicenca[i].unidadeTipoAvaliacao);
      delete (aux.unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoLicenca;

      aux.licenca = new Licenca(this.licenca.id);
      aux.id = this.licenca.unidadesTiposAvaliacoesLicenca[i].id;
      aux.ativo = this.licenca.unidadesTiposAvaliacoesLicenca[i].ativo;
      aux.ordem = this.licenca.unidadesTiposAvaliacoesLicenca[i].ordem;

      this.licenca.unidadesTiposAvaliacoesLicenca[i] = aux
    }

    this.licencaRepository.saveUnidadesTiposAvaliacoesLicenca(this.licenca.id, this.licenca.unidadesTiposAvaliacoesLicenca)
      .then(result => {
        for (let i = 0; i < this.licenca.unidadesTiposAvaliacoesLicenca.length; i++)
          for (let k = 0; k < result.length; k++)
            if (result[k].unidadeTipoAvaliacao.id === this.licenca.unidadesTiposAvaliacoesLicenca[i].unidadeTipoAvaliacao.id) {
              (this.licenca.unidadesTiposAvaliacoesLicenca[i].unidadeTipoAvaliacao as any).unidadeTipoAvaliacaoLicenca = result[k];
              for (let c = 0; c < this.unidades.length; c++)
                if (this.unidades[c].id === result[k].unidadeTipoAvaliacao.unidade.id)
                  for (let j = 0; j < this.unidades[c].unidadesTiposAvaliacoes.length; j++)
                    if (this.unidades[c].unidadesTiposAvaliacoes[j].id === result[k].unidadeTipoAvaliacao.id)
                      this.unidades[c].unidadesTiposAvaliacoes[j].unidadeTipoAvaliacaoLicenca.id = result[k].id
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
