import {Component, EventEmitter, Input, Output} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {FormBuilder} from "@angular/forms";
import {Assinatura} from "../../../../entity/assinatura/assinatura.model";
import {viewAnimation} from "../../../controls/utils";
import {PlanoRepository} from "../../../../repository/plano.repository";
import {Plano} from "../../../../entity/assinatura/plano.model";
import {AssinaturaRepository} from "../../../../repository/assinatura.repository";
import {Dispositivo} from "../../../../entity/avaliacao/dispositivo.model";
import {DispositivoRepository} from "../../../../repository/dispositivo.repository";

// import * as moment from 'moment-timezone';

/**
 *
 */
@Component({
  selector: 'planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class PlanosComponent {

  /**
   *
   * @type {Configuracao}
   */
  @Input()
  public assinatura: Assinatura = new Assinatura();

  /**
   *
   * @type {Configuracao}
   */
  @Output()
  public assinaturaChange: EventEmitter<Assinatura> = new EventEmitter();

  /**
   *
   */
  @Input()
  form: any;

  /**
   *
   */
  planos: Plano[];

  /**
   *
   */
  dispositivos: Dispositivo[];

  /**
   *
   * @param planoRepository
   * @param fb
   * @param dispositivoRepository
   * @param assinaturaRepository
   */
  constructor(private fb: FormBuilder,
              private planoRepository: PlanoRepository,
              private dispositivoRepository: DispositivoRepository,
              private assinaturaRepository: AssinaturaRepository) {

    planoRepository.findAll().subscribe(result => {
      this.planos = result;

      dispositivoRepository.findAll().subscribe( dispositivos => {
        this.planos.forEach( plano => {
          (plano as any).quantidadeDispositivos = (dispositivos as any).numberOfElements
        })
      });

      if (!this.assinatura.plano)
        this.assinatura.plano = this.planos[0]
    })

  }

  /**
   *
   */
  public save(): void {
    this.assinaturaRepository.save(this.assinatura)
      .then(result => this.assinatura = result)
  }
}
