import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {textMasks} from '../../../../../../../application/controls/text-masks/text-masks';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {cnpjValidator} from "../../../../../../../application/controls/validators/validators";

@Component({
  selector: 'usuario-pessoa-juridica-form',
  templateUrl: './usuario-pessoa-juridica-form.component.html',
  styleUrls: ['./usuario-pessoa-juridica-form.component.css']
})
export class UsuarioPessoaJuridicaFormComponent implements OnInit, OnDestroy
{

  /*-------------------------------------------------------------------
   *                           ATTRIBUTES
   *-------------------------------------------------------------------*/
  /**
   *
   */
  @Input() form: any;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {{}}
   */
  @Input()
  usuario: any = {};

  /*-------------------------------------------------------------------
   *                           VALIDATORS
   *-------------------------------------------------------------------*/

  /*-------------------------------------------------------------------
   *                           CONSTRUCTORS
   *-------------------------------------------------------------------*/
  /**
   *
   */
  constructor(public snackBar: MatSnackBar, public fb: FormBuilder)
  {
  }

  /*-------------------------------------------------------------------
   *                           BEHAVIORS
   *-------------------------------------------------------------------*/

  /**
   *
   */
  ngOnInit()
  {
    const formGroup = new FormGroup({
      nomeResponsavel : new FormControl('nomeResponsavel', [Validators.required]),
      cnpj : new FormControl('cnpj', [Validators.required, cnpjValidator()]),
    });

    if (!this.form)
    {
      this.form = this.fb.group({});
    }

    this.form.addControl( 'pessoaJuridica', formGroup);
  }

  /**
   *
   */
  ngOnDestroy():void
  {
    this.form.removeControl('pessoaJuridica');
  }
}
