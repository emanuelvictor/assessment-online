import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {viewAnimation} from "../../../controls/utils";
import {Assinatura} from "../../../../entity/assinatura/assinatura.model";
import {textMasks} from "../../../controls/text-masks/text-masks";

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
      numeroCartao: new FormControl('numeroCartao', [Validators.required]),
      mesValidade: new FormControl('mesValidade', [Validators.required]),
      anoValidade: new FormControl('anoValidade', [Validators.required]),
      codigoSeguranca: new FormControl('codigoSeguranca', [Validators.required]),
      nomeTitularCartao: new FormControl('nomeTitularCartao', [Validators.required]),
      documentoTitularCartao: new FormControl('documentoTitularCartao', [Validators.required]),
      dataNascimentoTitularCartao: new FormControl('dataNascimentoTitularCartao', [Validators.required])
    });

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('cartao', formGroup);

  }

  /**
   *
   */
  ngOnDestroy(): void {
    this.form.removeControl('password');
  }
}
