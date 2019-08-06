import {Component, ElementRef, Inject, OnInit, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry, MatSnackBar} from "@angular/material";

import {FormBuilder} from "@angular/forms";
import {DispositivoRepository} from "../../../../repository/dispositivo.repository";
import {Dispositivo} from "../../../../entity/avaliacao/dispositivo.model";
import {ActivatedRoute, Router} from "@angular/router";
import {viewAnimation} from "../../../controls/utils";
import {UnidadeRepository} from "../../../../repository/unidade.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../repository/unidade-tipo-avaliacao.repository";
import {TipoAvaliacaoRepository} from "../../../../repository/tipo-avaliacao.repository";

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

  vincularUnidadeTipoSvaliacao: boolean;

  /**
   *
   * @param unidadeRepository
   * @param {MatSnackBar} snackBar
   * @param {ElementRef} element
   * @param {DispositivoRepository} dispositivoRepository
   * @param {Renderer} renderer
   * @param unidadeTipoAvaliacaoRepository
   * @param {FormBuilder} fb
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(private unidadeRepository: UnidadeRepository,
              @Inject(ElementRef) private element: ElementRef,
              private dispositivoRepository: DispositivoRepository,
              private tipoAvaliacaoRepository: TipoAvaliacaoRepository,
              private activatedRoute: ActivatedRoute, private router: Router,
              private unidadeTipoAvaliacaoRepository: UnidadeTipoAvaliacaoRepository,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private snackBar: MatSnackBar, private renderer: Renderer, private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit(): void {

    this.unidadeRepository.listLightByFilters({
      withUnidadesTiposAvaliacoesAtivasFilter: true
    }).subscribe(result => {
      this.unidades = result.content;

      // this.tipoAvaliacaoRepository.listByFilters(null).subscribe( result => {
      //   this.vincularUnidadeTipoSvaliacao = this.unidades.length && (this.unidades.length > 1 || (this.unidades.length === 1 && (this.unidades[0].unidadesTiposAvaliacoes && this.unidades[0].unidadesTiposAvaliacoes.length > 1)))
      // })

      for (let k = 0; k < this.unidades.length; k++) {

        this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: this.unidades[k].id, ativo: true})
          .subscribe(resulted => {
            console.log(resulted.content);
            this.unidades[k].unidadesTiposAvaliacoes = resulted.content;
            this.unidades[k].unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao => {
              this.unidades[k].unidadeTipoAvaliacaoDispositivoValue = false;
              unidadeTipoAvaliacao.unidadeTipoAvaliacaoDispositivo = {}
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
  public save(dispositivo): void {

    dispositivo.unidadesTiposAvaliacoesDispositivo = dispositivo.unidadesTiposAvaliacoesDispositivo.filter(unidadeTipoAvaliacaoDipositivo => unidadeTipoAvaliacaoDipositivo.ativo).map(unidadeTipoAvaliacaoDipositivo => {
      return {
        ordem: unidadeTipoAvaliacaoDipositivo.ordem,
        unidadeTipoAvaliacao: {id: unidadeTipoAvaliacaoDipositivo.unidadeTipoAvaliacao.id}
      }
    });

    dispositivo.unidadesTiposAvaliacoesDispositivo.forEach(unidadeTpoAvaliacaoDispositivo =>
      delete unidadeTpoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade
    );

    this.dispositivoRepository.save(dispositivo).then(result => {
      this.dispositivo = result;
      this.success('Dispositivo inserido com sucesso')
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
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    })
  }
}
