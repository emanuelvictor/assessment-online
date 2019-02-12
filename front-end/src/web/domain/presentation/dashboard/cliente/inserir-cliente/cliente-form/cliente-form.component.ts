import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer} from '@angular/core';
import {MatSnackBar} from '@angular/material';

import {FormBuilder, Validators} from '@angular/forms';
import {textMasks} from '../../../../controls/text-masks/text-masks';
import {Usuario} from '../../../../../entity/usuario/usuario.model';
import {confirmPassword, password} from '../../../../controls/validators/validators';

/**
 *
 */
@Component({
  selector: 'cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {

  /**
   *
   * @type {any}
   */
  fotoPath = null;

  /**
   *
   * @type {any}
   */
  arquivoFile = null;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   */
  form: any;

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
  cliente: Usuario;

  /**
   *
   * @param {Renderer} renderer
   * @param {MatSnackBar} snackBar
   * @param {FormBuilder} fb
   * @param {ElementRef} element
   */
  constructor(private fb: FormBuilder,
              private renderer: Renderer,
              private snackBar: MatSnackBar,
              @Inject(ElementRef) private element: ElementRef) {
  }

  /**
   *
   */
  ngOnInit() {

    this.form = this.fb.group({
      nome: ['nome', [Validators.required]],
      email: ['email', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['password', [Validators.required, password()]],
      confirmacaoPassword: ['confirmacaoPassword', [Validators.required, confirmPassword()]]
    });

    this.fotoPath = this.cliente.fotoPath;
    this.arquivoFile = this.cliente.arquivoFile;
  }

  /**
   *
   */
  public saveCliente(form: any): void {
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
          if (control.errors.exception)
            this.error(control.errors.exception);
          break;
        }
        if (control.controls && control.invalid) {
          for (const controlInner of control.controls) {
            const elemento = this.element.nativeElement.querySelector(controlInner.key);
            if (elemento && controlInner.invalid) {
              this.renderer.invokeElementMethod(elemento, 'focus', []);
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
      this.cliente.arquivoFile = this.arquivoFile;
      this.cliente.fotoPath = this.fotoPath;
      this.save.emit(this.cliente);
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
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }

  /**
   *
   * @param event
   */
  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.arquivoFile = fileList[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (arquivo: any) => {
        this.fotoPath = arquivo.target.result;
      };
    }
  }

  /**
   *
   */
  public removeFile() {
    this.fotoPath = null;
    this.arquivoFile = null;
  }
}
