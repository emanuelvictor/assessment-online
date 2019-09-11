import {Component, EventEmitter, Input, Output} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {FormBuilder} from "@angular/forms";
import {Assinatura} from "../../../../entity/assinatura/assinatura.model";
import {viewAnimation} from "../../../controls/utils";
import {PlanoRepository} from "../../../../repository/plano.repository";
import {Plano} from "../../../../entity/assinatura/plano.model";
import {AssinaturaRepository} from "../../../../repository/assinatura.repository";

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

  planos: Plano[];

  /**
   *
   * @param planoRepository
   * @param fb
   * @param assinaturaRepository
   */
  constructor(private fb: FormBuilder,
              private planoRepository: PlanoRepository,
              private assinaturaRepository: AssinaturaRepository) {

    planoRepository.findAll().subscribe(result => {
      this.planos = result;
      this.assinatura.plano = this.planos[0]
    })

  }

  /**
   *
   */
  public save(): void {
    this.assinaturaRepository.save(this.assinatura).then(result => this.assinatura = result)
  }
}