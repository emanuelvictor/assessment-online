import {Component, ElementRef, Inject, OnInit, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry, MatSnackBar} from "@angular/material";

import {FormBuilder} from "@angular/forms";
import {LicencaRepository} from "../../../../repository/licenca.repository";
import {Licenca} from "../../../../entity/avaliacao/licenca.model";
import {ActivatedRoute, Router} from "@angular/router";
import {viewAnimation} from "../../../controls/utils";
import {UnidadeRepository} from "../../../../repository/unidade.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../../../repository/unidade-tipo-avaliacao.repository";
import {UnidadeTipoAvaliacaoLicenca} from "../../../../entity/avaliacao/unidade-tipo-avaliacao-licenca.model";

/**
 *
 */
@Component({
  selector: 'inserir-licenca',
  templateUrl: './inserir-licenca.component.html',
  styleUrls: ['./inserir-licenca.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class InserirLicencaComponent implements OnInit {

  /**
   *
   */
  public licenca: Licenca = new Licenca();

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
   * @param unidadeRepository
   * @param {MatSnackBar} snackBar
   * @param {ElementRef} element
   * @param {LicencaRepository} licencaRepository
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
              private licencaRepository: LicencaRepository,
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

      for (let k = 0; k < this.unidades.length; k++) {

        // this.unidadeTipoAvaliacaoRepository.listByUnidadeId({unidadeId: this.unidades[k].id, ativo: true})
        this.unidadeTipoAvaliacaoRepository.listByFilters({unidadeId: this.unidades[k].id, ativo: true})
          .subscribe(resulted => {
            this.unidades[k].unidadesTiposAvaliacoes = resulted.content;

            this.unidades[k].unidadesTiposAvaliacoes.forEach(unidadeTipoAvaliacao => {
              this.unidades[k].unidadeTipoAvaliacaoLicencaValue = false;
              unidadeTipoAvaliacao.unidadeTipoAvaliacaoLicenca = {}
            });

            this.vincularUnidadeTipoSvaliacao = this.unidades.length && (this.unidades.length > 1 || (this.unidades.length === 1 && (this.unidades[0].unidadesTiposAvaliacoes && this.unidades[0].unidadesTiposAvaliacoes.length > 1)));

            if (!this.vincularUnidadeTipoSvaliacao) {
              const unidadeTipoAvaliacaoLicenca = new UnidadeTipoAvaliacaoLicenca();
              unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao = this.unidades[0].unidadesTiposAvaliacoes[0];
              unidadeTipoAvaliacaoLicenca.ativo = true;
              unidadeTipoAvaliacaoLicenca.ordem = 1;
              this.licenca.unidadesTiposAvaliacoesLicenca.push(unidadeTipoAvaliacaoLicenca)
            } else if (this.unidades[k].unidadesTiposAvaliacoes.length > 1) {

              this.unidades[k].unidadeTipoAvaliacaoLicencaValue = true;
              const unidadesTiposAvaliacoesLicenca: UnidadeTipoAvaliacaoLicenca[] = [];
              for (let i = 0; i < this.unidades[k].unidadesTiposAvaliacoes.length; i++) {
                const unidadeTipoAvaliacaoLicenca = new UnidadeTipoAvaliacaoLicenca();
                unidadeTipoAvaliacaoLicenca.unidadeTipoAvaliacao = this.unidades[k].unidadesTiposAvaliacoes[i];
                unidadeTipoAvaliacaoLicenca.ativo = true;
                unidadeTipoAvaliacaoLicenca.ordem = (i + 1);
                this.unidades[k].unidadesTiposAvaliacoes[i].unidadeTipoAvaliacaoLicenca = unidadeTipoAvaliacaoLicenca;
                unidadesTiposAvaliacoesLicenca.push(unidadeTipoAvaliacaoLicenca)
              }

              this.unidadesTiposAvaliacoesLicencaChange(unidadesTiposAvaliacoesLicenca)
            }
          })
      }
    })
  }

  /**
   *
   * @param $event
   */
  public unidadesTiposAvaliacoesLicencaChange($event) {

    $event.forEach(item => {

      for (let i = 0; i < this.licenca.unidadesTiposAvaliacoesLicenca.length; i++) {
        if (item.unidadeTipoAvaliacao.id === this.licenca.unidadesTiposAvaliacoesLicenca[i].unidadeTipoAvaliacao.id) {
          this.licenca.unidadesTiposAvaliacoesLicenca[i] = item;
          return
        }
      }

      this.licenca.unidadesTiposAvaliacoesLicenca.push(item)
    })
  }

  /**
   *
   */
  public save($event): void {

    const licenca = Object.assign($event, {});

    licenca.unidadesTiposAvaliacoesLicenca = Object.assign($event.unidadesTiposAvaliacoesLicenca, []);

    licenca.unidadesTiposAvaliacoesLicenca = licenca.unidadesTiposAvaliacoesLicenca.filter(unidadeTipoAvaliacaoDipositivo => unidadeTipoAvaliacaoDipositivo.ativo).map(unidadeTipoAvaliacaoDipositivo => {
      return {
        ativo: unidadeTipoAvaliacaoDipositivo.ativo,
        ordem: unidadeTipoAvaliacaoDipositivo.ordem,
        unidadeTipoAvaliacao: {id: unidadeTipoAvaliacaoDipositivo.unidadeTipoAvaliacao.id}
      }
    });

    licenca.unidadesTiposAvaliacoesLicenca.forEach(unidadeTpoAvaliacaoLicenca =>
      delete unidadeTpoAvaliacaoLicenca.unidadeTipoAvaliacao.unidade
    );

    if (licenca.unidadesTiposAvaliacoesLicenca.length > 0) {
      this.licencaRepository.save(licenca).then(result => {
        this.licenca = result;
        this.success('Licenca inserido com sucesso')
      });
    } else {
      this.openSnackBar('Selecione ao menos um Tipo de Avaliação')
    }
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
