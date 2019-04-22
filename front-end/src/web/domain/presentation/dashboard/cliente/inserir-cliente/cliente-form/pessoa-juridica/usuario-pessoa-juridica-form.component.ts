import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {textMasks} from "../../../../../controls/text-masks/text-masks";
import {cnpjValidator} from "../../../../../controls/validators/validators";

@Component({
  selector: 'usuario-pessoa-juridica-form',
  templateUrl: './usuario-pessoa-juridica-form.component.html',
  styleUrls: ['./usuario-pessoa-juridica-form.component.css']
})
export class UsuarioPessoaJuridicaFormComponent implements OnInit, OnDestroy {
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
  cliente: any = {};

  /**
   *
   */
  constructor(public snackBar: MatSnackBar, public fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit() {
    const formGroup = new FormGroup({
      cnpj: new FormControl('cnpj', [Validators.required, cnpjValidator()])
    });

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('pessoaJuridica', formGroup);
  }

  /**
   *
   */
  ngOnDestroy(): void {
    this.form.removeControl('pessoaJuridica');
  }
}
