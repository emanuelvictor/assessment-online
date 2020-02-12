import {Component, ElementRef, Inject, Renderer2} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from '@angular/platform-browser';

import {FormBuilder} from '@angular/forms';
import {TipoAvaliacaoRepository} from '@src/sistema/domain/repository/tipo-avaliacao.repository';
import {TipoAvaliacao} from '@src/sistema/domain/entity/avaliacao/tipo-avaliacao.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';
import {MatIconRegistry} from "@angular/material/icon";

/**
 *
 */
@Component({
  selector: 'inserir-tipo-avaliacao',
  templateUrl: './inserir-tipo-avaliacao.component.html',
  styleUrls: ['./inserir-tipo-avaliacao.component.scss']
})
export class InserirTipoAvaliacaoComponent {

  /**
   *
   */
  public tipoAvaliacao: TipoAvaliacao = new TipoAvaliacao();

  /**
   *
   * @param {MatSnackBar} toastService
   * @param {ElementRef} element
   * @param {TipoAvaliacaoRepository} tipoAvaliacaoRepository
   * @param {Renderer} renderer
   * @param {FormBuilder} fb
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(@Inject(ElementRef) private element: ElementRef,
              private tipoAvaliacaoRepository: TipoAvaliacaoRepository,
              private activatedRoute: ActivatedRoute, private router: Router,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private toastService: ToastService, private renderer: Renderer2, private fb: FormBuilder) {
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
    this.toastService.open(message, 'Fechar', {
      duration: 5000
    });
  }

}
