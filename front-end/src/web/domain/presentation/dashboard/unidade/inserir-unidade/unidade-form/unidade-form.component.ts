import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer} from '@angular/core';
import {MatSnackBar} from '@angular/material';

import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {textMasks} from "../../../../controls/text-masks/text-masks";
import {Unidade} from "../../../../../entity/unidade/unidade.model";
import {cnpjValidator} from "../../../../controls/validators/validators";

/**
 *
 */
@Component({
  selector: 'unidade-form',
  templateUrl: './unidade-form.component.html',
  styleUrls: ['./unidade-form.component.css']
})
export class UnidadeFormComponent implements OnInit {

  /**
   *
   */
  form: any;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
  @Output()
  save: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @type {Unidade}
   */
  @Input()
  unidade: Unidade;

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {FormBuilder} fb
   * @param {ElementRef} element
   * @param {Renderer} renderer
   */
  constructor(public snackBar: MatSnackBar, public fb: FormBuilder, @Inject(ElementRef) public element: ElementRef, public renderer: Renderer) {
  }

  /**
   *
   */
  ngOnInit() {
    this.form = this.fb.group({
      nome: ['nome', [Validators.required]],
      cnpj: new FormControl('cnpj', [cnpjValidator()]),
    });
  }

  /**
   *
   */
  public saveUnidade(form: any): void {
    // TODO provisório
    let valid = true;
    const controls: any = [];
    Object.keys(form.controls).map(function (key) {
      if (form.controls[key].invalid) {
        const control = form.controls[key];
        control.key = '#' + key;
        if (control.controls) {
          Object.keys(control.controls).map(function (key) {
            if (control.controls[key].invalid) {
              const controlInner = control.controls[key];
              controlInner.key = '#' + key;
              controls.push(controlInner);
            }
          });
        } else {
          controls.push(control);
        }
      }
    });

    for (const control of controls) {
      if (control) {
        const element = this.element.nativeElement.querySelector(control.key);
        if (element && control.invalid) {
          this.renderer.invokeElementMethod(element, 'focus', []);
          valid = false;
          if (control.errors.exception) {
            this.error(control.errors.exception);
          }
          break;
        }
        if (control.controls && control.invalid) {
          for (const controlInner of control.controls) {
            const element = this.element.nativeElement.querySelector(controlInner.key);
            if (element && controlInner.invalid) {
              this.renderer.invokeElementMethod(element, 'focus', []);
              valid = false;
              if (controlInner.errors.exception) {
                this.error(controlInner.errors.exception);
              }
              break;
            }
          }
        }
      }
    }

    if (valid) {
      const unidade = Object.assign({}, this.unidade);
      unidade.endereco = Object.assign({}, this.unidade.endereco);
      unidade.endereco.cidade = Object.assign({}, this.unidade.endereco.cidade);
      unidade.endereco.cidade.estado = Object.assign({}, this.unidade.endereco.cidade.estado);
      unidade.endereco.cidade.estado.pais = Object.assign({}, this.unidade.endereco.cidade.estado.pais);
      if (unidade.endereco.cidade && (!unidade.endereco.cidade.nome || !unidade.endereco.cidade.nome.length))
        unidade.endereco.cidade = null;
      this.save.emit(unidade);
    }
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message);
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    });
  }
}
