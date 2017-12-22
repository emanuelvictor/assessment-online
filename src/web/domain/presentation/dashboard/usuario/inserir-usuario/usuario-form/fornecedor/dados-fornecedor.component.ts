
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material";
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Usuario} from "../../../../../../entity/usuario/usuario.model";

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
  usuario: Usuario = new Usuario();

  /**
   *
   */
  @Input() form: any;

  /**
   *
   */
  constructor(public snackBar: MatSnackBar, public fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit() {

    if (!this.usuario.areasAtuacao || !this.usuario.areasAtuacao.length) {
      this.usuario.areasAtuacao = [];

      this.usuario.areasAtuacao.push({'id': null, 'checked': true, 'tipoResiduo': 'VIDRO', quantidade : null});

      this.usuario.areasAtuacao.push({'id': null, 'checked': true, 'tipoResiduo': 'PAPEL', quantidade : null});

      this.usuario.areasAtuacao.push({'id': null, 'checked': true, 'tipoResiduo': 'METAL', quantidade : null});

      this.usuario.areasAtuacao.push({'id': null, 'checked': true, 'tipoResiduo': 'PLASTICO', quantidade : null});

      this.usuario.areasAtuacao.push({'id': null, 'checked': true, 'tipoResiduo': 'ORGANICO', quantidade : null});
    }

    if (!this.form) {
      this.form = this.fb.group({});
      return;
    }

    const formGroup = new FormGroup({});

    for (var _i = 0; _i < 5; _i++) {
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
