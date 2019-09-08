import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {viewAnimation} from "../../../controls/utils";
import {Assinatura} from "../../../../entity/assinatura/assinatura.model";
import {textMasks} from "../../../controls/text-masks/text-masks";
// import * as moment from 'moment-timezone';
import {obrigatorio} from "../../../controls/validators/validators";

/**
 *
 */
@Component({
  selector: 'cartao',
  templateUrl: './cartao.component.html',
  styleUrls: ['./cartao.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class CartaoComponent implements OnInit, OnDestroy {

  /**
   *
   */
  @Input()
  publicKey: string;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Configuracao}
   */
  @Input()
  public assinatura: Assinatura = new Assinatura();

  /**
   *
   */
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
      numeroCartao: new FormControl('numeroCartao', [obrigatorio('O número do cartão é obrigatório'), this.cartaoCreditoValidator()]),
      mesValidade: new FormControl('mesValidade', [obrigatorio('O mês de validade é obrigatório')]),
      anoValidade: new FormControl('anoValidade', [obrigatorio('O ano de validade é obrigatório')]),
      codigoSeguranca: new FormControl('codigoSeguranca', [obrigatorio('O código de segurança é obrigatório')]),
      nomeTitularCartao: new FormControl('nomeTitularCartao', [obrigatorio('O nome do titular é obrigatório')]),
      dataNascimentoTitularCartao: new FormControl('dataNascimentoTitularCartao', [this.dataNascimentoTitularCartaoValidator()])
    });

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('cartao', formGroup);

  }

  /**
   *
   * @param exception
   * @param validatorFn
   */
  public cartaoCreditoValidator(exception?: string, validatorFn?: ValidatorFn): ValidatorFn {
    if (validatorFn) {
      return validatorFn
    }

    return (c: AbstractControl): { [key: string]: any } => {

      const Moip = window['Moip'];
      const cc = new Moip.CreditCard({
        number: c.value,
        cvc: this.assinatura.codigoSeguranca,
        expMonth: this.assinatura.mesValidade,
        expYear: this.assinatura.anoValidade,
        pubKey: this.publicKey
      });
      console.log(cc);
      if (!cc.isValid()) {
          return {
            exception: exception ? exception : 'Cartão inválido'
          }
      }

      return null
    }
  }

  /**
   *
   * @param exception
   * @param validatorFn
   */
  public dataNascimentoTitularCartaoValidator(exception?: string, validatorFn?: ValidatorFn): ValidatorFn {
    if (validatorFn) {
      return validatorFn
    }
    return (c: AbstractControl): { [key: string]: any } => {

      if (!c || !c.value) {
        return {
          exception: exception ? exception : 'Defina uma data'
        };
      }

      if (c.value.length < 8) {
        return {
          exception: 'Data inválida'
        };
      }

      // const momentData = moment(c.value, "DD-MM-YYYY");
      //
      // if (momentData.isAfter(moment())) {
      //   return {
      //     exception: 'Insira uma data anterior à de hoje'
      //   };
      // }

      return null
    }
  }

  /**
   *
   */
  ngOnDestroy(): void {
    this.form.removeControl('password');
  }
}
