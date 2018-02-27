import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {confirmPassword, password} from "../../../../../controls/validators/validators";
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Usuario} from '../../../../../../entity/usuario/Usuario.model';

@Component({
  selector: 'password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.css']
})
export class PasswordFormComponent implements OnInit, OnDestroy
{

  /**
   *
   */
  @Input() form: any;

  /**
   *
   */
  @Input() usuario: Usuario;

  /**
   *
   */
  confirmacaoPassword: string;

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {FormBuilder} fb
   */
  constructor(public snackBar: MatSnackBar, public fb: FormBuilder)
  {
  }

  /**
   *
   */
  ngOnInit()
  {
    const formGroup = new FormGroup({
      password: new FormControl('password', [Validators.required, password()]),
      confirmacaoPassword: new FormControl('confirmacaoPassword', [Validators.required, confirmPassword()])
    });

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('password', formGroup);
  }

  /**
   *
   */
  ngOnDestroy(): void
  {
    this.form.removeControl('password');
  }
}
