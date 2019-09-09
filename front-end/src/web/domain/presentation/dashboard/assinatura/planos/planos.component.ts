import {Component, Input, OnInit} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Assinatura} from "../../../../entity/assinatura/assinatura.model";
import {viewAnimation} from "../../../controls/utils";
import {obrigatorio} from "../../../controls/validators/validators";

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

  /**
   *
   * @param fb
   */
  constructor(private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit(): void {

    const formGroup = new FormGroup({
      numeroCartao: new FormControl('numeroCartao', [obrigatorio('O número do cartão é obrigatório')]),
    });

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('planos', formGroup);

  }
}
