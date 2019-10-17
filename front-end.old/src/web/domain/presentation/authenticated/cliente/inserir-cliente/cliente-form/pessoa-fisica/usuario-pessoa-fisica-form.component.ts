import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {textMasks} from "../../../../../controls/text-masks/text-masks";
import {cpfValidator, obrigatorio} from "../../../../../controls/validators/validators";

@Component({
  selector: 'usuario-pessoa-fisica-form',
  templateUrl: './usuario-pessoa-fisica-form.component.html',
  styleUrls: ['./usuario-pessoa-fisica-form.component.css']
})
export class UsuarioPessoaFisicaFormComponent implements OnInit, OnDestroy {

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
  documento: string = '';

  /**
   *
   * @type {{}}
   */
  @Output()
  documentoChange: EventEmitter<string> = new EventEmitter<string>();

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
      cpf: new FormControl('cpf', [obrigatorio('O CPF é obrigatório'), cpfValidator()])
    });

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('pessoaFisica', formGroup);
  }

  /**
   *
   */
  ngOnDestroy(): void {
    this.form.removeControl('pessoaFisica');
  }
}
