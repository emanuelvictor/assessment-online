import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Unidade} from '../../../../entity/unidade/unidade.model';
import {UnidadeService} from '../../../../service/unidade.service';
import {ConfirmDialogComponent} from '../../../controls/confirm-dialog/confirm-dialog.component';
import {AuthenticationService} from "../../../../service/authentication.service";
import {TipoAvaliacaoRepository} from "../../../../repositories/tipo-avaliacao.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../repositories/unidade-tipo-avaliacao.repository";
import {viewAnimation} from "../../../controls/utils";
import {UnidadeTipoAvaliacao} from "../../../../entity/avaliacao/unidade-tipo-avaliacao.model";

@Component({
  selector: 'visualizar-unidade',
  templateUrl: './visualizar-unidade.component.html',
  styleUrls: ['./visualizar-unidade.component.css'],
  animations: [
    viewAnimation
  ]
})
export class VisualizarUnidadeComponent implements OnInit {

  /**
   *
   */
  public tiposAvaliacoes: any;

  /**
   *
   */
  unidade: Unidade;

  /**
   *
   */
  authenticatedUser: any;

  /**
   * 
   * @type {{nome: any; enunciado: any}}
   */
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
  constructor(private snackBar: MatSnackBar,
              private authenticationService: AuthenticationService,
              private tipoAvaliacaoRepository: TipoAvaliacaoRepository,
              public activatedRoute: ActivatedRoute, private router: Router,
              private dialog: MatDialog, private unidadeService: UnidadeService,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository) {

    this.authenticationService.requestContaAutenticada().subscribe(result => {
      this.authenticatedUser = result;
    });
  }

  /**
   *
   */
  ngOnInit() {
    const unidadeId: number = this.activatedRoute.snapshot.params['id'];
    this.findById(unidadeId);

    this.tipoAvaliacaoRepository.listByFilters(null)
      .subscribe(result => {
        this.tiposAvaliacoes = result.content;

        this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: unidadeId}).subscribe(page => {
          this.unidadesTiposAvaliacoes = page.content;
          for (let k = 0; k < this.unidadesTiposAvaliacoes.length; k++)
            for (let i = 0; i < this.tiposAvaliacoes.length; i++)
              if (this.tiposAvaliacoes[i].id === this.unidadesTiposAvaliacoes[k].tipoAvaliacao.id)
                this.tiposAvaliacoes[i].ativo = this.unidadesTiposAvaliacoes[k].ativo;
        });
      });
  }

  /**
   *
   * @param {number} id
   */
  public findById(id: number) {
    this.unidadeService.findById(id)
      .subscribe(result => this.unidade = result)
  }

  /**
   *
   */
  public remove() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Isso vai remover também todas as avaliações realizadas para esta unidade, incluindo as vinculadas á ítens avaliáveis. Deseja realmente prosseguir?',
          confirm: 'Sim',
          cancel: 'Não'
        }
      }
    );

    dialogRef.afterClosed().subscribe(remover => {
      if (remover) {
        this.unidadeService.delete(this.unidade.id)
          .then(() => {
            this.router.navigate(['../'], {relativeTo: this.activatedRoute});
            this.snackBar.open('Unidade excluído com sucesso', 'Fechar', {
              duration: 3000
            });
          })
      }
    });
  }

  /**
   *
   * @param {TipoAvaliacao} tipoAvaliacao
   */
  public saveUnidadeTipoAvaliacao(tipoAvaliacao): void {

    const unidadeTipoAvaliacao: UnidadeTipoAvaliacao = new UnidadeTipoAvaliacao();
    unidadeTipoAvaliacao.tipoAvaliacao = tipoAvaliacao;
    unidadeTipoAvaliacao.unidade = this.unidade;
    unidadeTipoAvaliacao.ativo = tipoAvaliacao.ativo;

    for (let i = 0; i < this.unidadesTiposAvaliacoes.length; i++)
      if (tipoAvaliacao.id === this.unidadesTiposAvaliacoes[i].tipoAvaliacao.id)
        unidadeTipoAvaliacao.id = this.unidadesTiposAvaliacoes[i].id;

    this.unidadeTipoAvaliacaoRepository.save(unidadeTipoAvaliacao)
      .then(result => {
        this.openSnackBar(result.ativo ? 'Vínculo criado com sucesso' : 'Vínculo removido');

        for (let i = 0; i < this.unidadesTiposAvaliacoes.length; i++)
          if (result.id === this.unidadesTiposAvaliacoes[i].id) {
            this.unidadesTiposAvaliacoes[i] = result;
            return;
          }

        this.unidadesTiposAvaliacoes.push(result);

      });
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
