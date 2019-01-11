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
   * @type {{tipoAvaliacao: {nome: any; enunciado: any}}}
   */
  public filter: any = {
    tipoAvaliacao: {
      nome: null,
      enunciado: null
    }
  };

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
    const id: number = this.activatedRoute.snapshot.params['id'];
    this.findById(id);
    this.tipoAvaliacaoRepository.listByFilters(null)
      .subscribe(result => this.tiposAvaliacoes = result.content);
  }

  /**
   *
   * @param {number} id
   */
  public findById(id: number) {
    this.unidadeService.findById(id)
      .subscribe(result => {
        this.unidade = result;
      })
  }

  /**
   *
   */
  public remove() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          text: 'Deseja realmente excluir a unidade?',
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
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }

}
