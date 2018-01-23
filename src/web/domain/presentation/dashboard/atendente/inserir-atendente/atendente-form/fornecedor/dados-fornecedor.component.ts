import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material";
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Atendente} from "../../../../../../entity/atendente/Atendente.model";

@Component({
  selector: 'dados-fornecedor-form',
  templateUrl: './dados-fornecedor.component.html',
  styleUrls: ['./dados-fornecedor.component.css']
})
export class DadosFornecedorComponent implements OnInit, OnDestroy {

  /**
   *
   * @type {{}}
   */
  @Input()
  usuario: Atendente = new Atendente();

  /**
   *
   */
  @Input() form: any;

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
    if (!this.form) {
      this.form = this.fb.group({});
      return;
    }

    const formGroup = new FormGroup({});

    for (let _i = 0; _i < 5; _i++) {
      formGroup.addControl('quantidade' + _i, new FormControl('quantidade' + _i, [Validators.min(0)]));
    }

    this.form.addControl('fornecedor', formGroup);
  }

  /**
   *
   */
  ngOnDestroy(): void {
    this.form.removeControl('fornecedor');
  }
}
