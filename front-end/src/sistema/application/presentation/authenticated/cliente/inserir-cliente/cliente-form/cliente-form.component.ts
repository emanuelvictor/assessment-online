import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';

import {AbstractControl, FormBuilder, ValidatorFn, Validators} from '@angular/forms';
import {textMasks} from '../../../../controls/text-masks/text-masks';
import {HttpClient} from '@angular/common/http';
import {RecaptchaComponent} from 'ng-recaptcha';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';
import {Usuario} from "@src/sistema/domain/entity/usuario/usuario.model";

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
   */
  @ViewChild('reCaptcha', {static: false})
  reCaptcha: RecaptchaComponent;

  /**
   *
   */
  confirmacaoPassword: string = null;

  /**
   *
   * @param {Renderer} renderer
   * @param {MatSnackBar} toastService
   * @param {FormBuilder} fb
   * @param http
   * @param {ElementRef} element
   */
  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private renderer: Renderer2,
              private toastService: ToastService,
              @Inject(ElementRef) private element: ElementRef) {
  }

  /**
   *
   */
  ngOnInit() {
    this.form = this.fb.group({
      nome: ['nome', [Validators.required]],
      email: ['email', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['password', [Validators.required, this.novaSenhaValidator()]],
      confirmacaoPassword: ['confirmacaoPassword', [Validators.required, this.confirmarSenhaValidator()]],
      recaptchaReactive: ['recaptchaReactive', [Validators.required]]
    });

    this.fotoPath = this.cliente.fotoPath;
    this.arquivoFile = this.cliente.arquivoFile;
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

      if (((this.cliente.conta.email && this.cliente.conta.email.length) || this.cliente.conta.administrador) && (!c.value || !c.value.length)) {
        return {
          exception: exception ? exception : 'Defina uma a nova senha'
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

      if (this.cliente.conta.password && this.cliente.conta.password.length && (!c.value || !c.value.length)) {
        return {
          exception: exception ? exception : 'Confirme a nova senha'
        };
      }

      if ((this.cliente.conta.password && this.cliente.conta.password.length) && this.cliente.conta.password !== c.value) {
        return {
          exception: exception ? exception : 'A nova senha e a confirmação não coincidem'
        };
      }

      return null
    }
  }

  /**
   *
   * @param {string} captchaResponse
   */
  resolved(captchaResponse: string) {
    this.cliente.recap = captchaResponse;
  }

  /**
   *
   */
  reset() {
    this.reCaptcha.reset();
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
          element.focus();
          valid = false;
          if (control.errors.exception) {
            this.error(control.errors.exception);
          }
          break;
        }
        if (control.controls && control.invalid) {
          for (const controlInner of control.controls) {
            const elemento = this.element.nativeElement.querySelector(controlInner.key);
            if (elemento && controlInner.invalid) {
              elemento.focus();
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
      this.cliente.arquivoFile = this.arquivoFile;
      this.cliente.fotoPath = this.fotoPath;
      this.save.emit(this.cliente);
      this.reset()
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
    this.toastService.open(message, 'Fechar', {
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
