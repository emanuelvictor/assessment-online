import creditCardType, {types as CardType} from 'credit-card-type';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {viewAnimation} from '../../../../controls/utils';
import {textMasks} from '../../../../controls/text-masks/text-masks';
import {Assinatura} from '../../../../../../domain/entity/assinatura/assinatura.model';
import {obrigatorio} from '../../../../controls/validators/validators';

// import * as moment from 'moment-timezone';

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
      numeroCartao: new FormControl('numeroCartao', [obrigatorio('O número do cartão é obrigatório'), this.cartaoCreditoValidator()]),
      mesValidade: new FormControl('mesValidade', [obrigatorio('O mês de validade é obrigatório')]),
      anoValidade: new FormControl('anoValidade', [obrigatorio('O ano de validade é obrigatório')]),
      codigoSeguranca: new FormControl('codigoSeguranca', [this.codigoSegurancaObrigatorio('O código de segurança é obrigatório')]),
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

      if (c.value) {
        const cards = creditCardType(c.value).filter(function (card) {
          return card.type === CardType.MASTERCARD || card.type === CardType.VISA || card.type == CardType.DINERS_CLUB || card.type === CardType.AMERICAN_EXPRESS || card.type === CardType.ELO;
        });

        if (!cards.length) {
          return {
            exception: exception ? exception : 'São permitidos somente os cartões Visa, MasterCard, Dinners Club, American Express e Elo'
          }
        }
      }

      const Moip = window['Moip'];

      const cc = new Moip.CreditCard({
        number: c.value,
        cvc: this.assinatura.codigoSeguranca,
        expMonth: this.assinatura.mesValidade,
        expYear: this.assinatura.anoValidade,
        pubKey: this.publicKey
      });

      if (this.assinatura.codigoSeguranca && this.assinatura.mesValidade && this.assinatura.anoValidade && this.publicKey) {
        if (!cc.isValid()) {
          return {
            exception: exception ? exception : 'Cartão inválido'
          }
        } else if (cc.isValid()) {
          this.assinatura.hash = cc.hash()
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
        }
      }

      if (c.value.length < 8) {
        return {
          exception: 'Data inválida'
        }
      }

      return null
    }
  }

  // Validação de obrigatorio
  codigoSegurancaObrigatorio(exception?: string, validatorFn?: ValidatorFn): ValidatorFn {
    if (validatorFn) {
      return validatorFn;
    }
    return (c: AbstractControl): { [key: string]: any } => {

      if (typeof c.value === 'number') {
        if (!c.value && !this.assinatura.hash) {
          return {
            exception: exception ? exception : 'Campo obrigatório'
          }
        } else {
          return null;
        }
      }

      if ((!c.value || !c.value.length) && !this.assinatura.hash) {
        return {
          exception: exception ? exception : 'Campo obrigatório'
        }
      }

      return null
    }
  }

  /**
   *
   */
  ngOnDestroy(): void {
    this.form.removeControl('cartao')
  }
}
