import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {FormBuilder, Validators} from "@angular/forms";
import {textMasks} from "../../../../../../application/controls/text-masks/text-masks";
import {Usuario} from "../../../../../entity/usuario/usuario.model";
import {Endereco} from "../../../../../entity/endereco/endereco.model";
import {Cidade} from "../../../../../entity/endereco/cidade.model";

/**
 *
 */
@Component({
  selector: 'usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
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
   * @type {Usuario}
   */
  @Input()
  usuario: Usuario;

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
    if (!this.usuario.endereco) {
      this.usuario.endereco = new Endereco("", "", "", "", "", new Cidade(), 0, 0);
    }

    this.form = this.fb.group({
      nome: ['nome', [Validators.required]],
      email: ['email', [/*Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')*/]],
      contatoTelefonico: ['contatoTelefonico', [Validators.min(11111111), Validators.max(999999999)]],
    });
  }

  /**
   *
   */
  public saveUsuario(form: any): void {
    // TODO provisório
    let valid = true;
    let controls: any = [];
    Object.keys(form.controls).map(function (key) {
      if (form.controls[key].invalid) {
        let control = form.controls[key];
        control.key = '#' + key;
        if (control.controls) {
          Object.keys(control.controls).map(function (key) {
            if (control.controls[key].invalid) {
              let controlInner = control.controls[key];
              controlInner.key = '#' + key;
              controls.push(controlInner);
            }
          });
        }
        else {
          controls.push(control);
        }
      }
    });

    for (let control of controls) {
      if (control) {
        const element = this.element.nativeElement.querySelector(control.key);
        if (element && control.invalid) {
          this.renderer.invokeElementMethod(element, 'focus', []);
          valid = false;
          if (control.errors.exception)
            this.error(control.errors.exception);
          break;
        }
        if (control.controls && control.invalid) {
          for (let controlInner of control.controls) {
            const element = this.element.nativeElement.querySelector(controlInner.key);
            if (element && controlInner.invalid) {
              this.renderer.invokeElementMethod(element, 'focus', []);
              valid = false;
              if (controlInner.errors.exception)
                this.error(controlInner.errors.exception);
              break;
            }
          }
        }
      }
    }

    if (valid) {
      this.save.emit(this.usuario);
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