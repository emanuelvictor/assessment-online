import {Component, Input, OnInit} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Assinatura} from "../../../../entity/assinatura/assinatura.model";
import {viewAnimation} from "../../../controls/utils";
import {obrigatorio} from "../../../controls/validators/validators";
import {PlanoRepository} from "../../../../repository/plano.repository";
import {Plano} from "../../../../entity/assinatura/plano.model";

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
export class PlanosComponent implements OnInit {

  /**
   *
   * @type {Configuracao}
   */
  @Input()
  public assinatura: Assinatura = new Assinatura();

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
   */
  constructor(private planoRepository: PlanoRepository, private fb: FormBuilder) {
    planoRepository.findAll().subscribe( result => {
      this.planos = result;
      this.assinatura.plano = this.planos[0]
    })
  }

  /**
   *
   */
  ngOnInit(): void {

  }
}
