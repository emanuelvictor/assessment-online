import {MatSnackBar} from '@angular/material';

import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {confirmPassword, password} from "../../../../../controls/validators/validators";
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Usuario} from '../../../../../../entity/usuario/usuario.model';
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
      password: new FormControl('password', [password()]),
      confirmacaoPassword: new FormControl('confirmacaoPassword', [confirmPassword()])
    });

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('password', formGroup);
  }

  /**
   *
   */
  ngOnDestroy(): void {
    this.form.removeControl('password');
  }
}
