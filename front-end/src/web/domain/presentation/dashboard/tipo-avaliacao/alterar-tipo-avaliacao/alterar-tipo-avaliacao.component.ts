import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {DomSanitizer} from "@angular/platform-browser";
import {TipoAvaliacaoRepository} from "../../../../repositories/tipo-avaliacao.repository";
import {TipoAvaliacao} from "../../../../entity/avaliacao/tipo-avaliacao.model";

@Component({
  selector: 'alterar-tipo-avaliacao',
  templateUrl: './alterar-tipo-avaliacao.component.html',
  styleUrls: ['./alterar-tipo-avaliacao.component.scss']
})
export class AlterarTipoAvaliacaoComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {TipoAvaliacao}
   */
  tipoAvaliacao: TipoAvaliacao = new TipoAvaliacao();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   * @param {TipoAvaliacaoRepository} tipoAvaliacaoRepository
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   */
  constructor(private snackBar: MatSnackBar,
              private domSanitizer: DomSanitizer,
              private tipoAvaliacaoRepository: TipoAvaliacaoRepository,
              private activatedRoute: ActivatedRoute, private router: Router) {

  }

  /**
   *
   */
  ngOnInit() {
    const avaliacaoId: number = this.activatedRoute.snapshot.params['id'];
    this.find(avaliacaoId);
  }

  /**
   *
   */
  public save(): void {
    this.tipoAvaliacaoRepository.save(this.tipoAvaliacao)
      .then(result => {
        this.tipoAvaliacao = result;

        this.success('Tipo de avaliação inserida com sucesso');
      });
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  /**
   *
   * @param {number} avaliacaoId
   */
  public find(avaliacaoId: number) {
    this.tipoAvaliacaoRepository.findById(avaliacaoId)
      .subscribe((tipoAvaliacao: TipoAvaliacao) => {
          this.tipoAvaliacao = tipoAvaliacao;
        }
      )
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
