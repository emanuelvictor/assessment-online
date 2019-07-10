import {Component, ElementRef, Inject, OnInit, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry, MatSnackBar} from "@angular/material";

import {FormBuilder} from "@angular/forms";
import {DispositivoRepository} from "../../../../repository/dispositivo.repository";
import {Dispositivo} from "../../../../entity/avaliacao/dispositivo.model";
import {ActivatedRoute, Router} from "@angular/router";
import {viewAnimation} from "../../../controls/utils";

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
   * @param {MatSnackBar} snackBar
   * @param {ElementRef} element
   * @param {DispositivoRepository} dispositivoRepository
   * @param {Renderer} renderer
   * @param {FormBuilder} fb
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(@Inject(ElementRef) private element: ElementRef,
              private dispositivoRepository: DispositivoRepository,
              private activatedRoute: ActivatedRoute, private router: Router,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private snackBar: MatSnackBar, private renderer: Renderer, private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit(): void {
  }

  /**
   *
   */
  public save(): void {

    this.dispositivo.unidadesTiposAvaliacoesDispositivo.forEach(unidadeTpoAvaliacaoDispositivo =>
      delete unidadeTpoAvaliacaoDispositivo.unidadeTipoAvaliacao.unidade
    );

    this.dispositivoRepository.save(this.dispositivo).then(result => {
      this.dispositivo = result;
      this.success('Dispositivo inserido com sucesso')
    })
  }

  /**
   *
   * @param $event
   */
  add($event: any) {
    this.dispositivo.unidadesTiposAvaliacoesDispositivo.push($event);
    console.log(this.dispositivo.unidadesTiposAvaliacoesDispositivo)
  }

  /**
   *
   * @param $event
   */
  remove($event: any) {
    for (let i = 0; i < this.dispositivo.unidadesTiposAvaliacoesDispositivo.length; i++) {
      if (this.dispositivo.unidadesTiposAvaliacoesDispositivo[i].unidadeTipoAvaliacao.id === $event.unidadeTipoAvaliacao.id)
        this.dispositivo.unidadesTiposAvaliacoesDispositivo.splice(i, 1);
    }
    console.log(this.dispositivo.unidadesTiposAvaliacoesDispositivo)
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
