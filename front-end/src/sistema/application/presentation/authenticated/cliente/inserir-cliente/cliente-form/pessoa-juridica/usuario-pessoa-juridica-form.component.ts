import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {textMasks} from '../../../../../controls/text-masks/text-masks';
import {cnpjValidator, obrigatorio} from '../../../../../controls/validators/validators';

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
  constructor(public fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit() {
    const formGroup = new FormGroup({
      cnpj: new FormControl('cnpj', [obrigatorio('O CNPJ é obrigatório'), cnpjValidator()])
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
