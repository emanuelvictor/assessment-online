import {MatSnackBar} from '@angular/material';

import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Conta} from '../../../../../../entity/usuario/conta.model';

@Component({
  selector: 'password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.css']
})
export class PasswordFormComponent implements OnInit, OnDestroy {

  /**
   *
   */
  @Input() form: any;

  /**
   *
   */
  @Input() conta: Conta;

  /**
   *
   */
  confirmacaoPassword: string = null;

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {FormBuilder} fb
   */
  constructor(public snackBar: MatSnackBar, public fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit() {
    const formGroup = new FormGroup({
      password: new FormControl('password', [this.novaSenhaValidator()]),
      confirmacaoPassword: new FormControl('confirmacaoPassword', [this.confirmarSenhaValidator()])
    });

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('password', formGroup);
  }

  /**
   *
   * @param exception
   * @param validatorFn
   */
  public novaSenhaValidator(exception?: string, validatorFn?: ValidatorFn): ValidatorFn {
    if (validatorFn) {
      return validatorFn;
    }
    return (c: AbstractControl): { [key: string]: any } => {

      if (((this.conta.email && this.conta.email.length) || this.conta.administrador) && (!c.value || !c.value.length)) {
        return {
          exception: exception ? exception : 'A senha é obrigatória caso o Item Avaliável tenha um e-mail'
        };
      }

      return null
    }
  }

  /**
   *
   * @param exception
   * @param validatorFn
   */
  public confirmarSenhaValidator(exception?: string, validatorFn?: ValidatorFn): ValidatorFn {
    if (validatorFn) {
      return validatorFn;
    }
    return (c: AbstractControl): { [key: string]: any } => {

      if (this.conta.password && this.conta.password.length && (!c.value || !c.value.length)) {
        return {
          exception: exception ? exception : 'Confirme a nova senha'
        };
      }

      if ((this.conta.password && this.conta.password.length) && this.conta.password !== c.value) {
        return {
          exception: exception ? exception : 'A nova senha e a confirmação não coincidem'
        };
      }

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
