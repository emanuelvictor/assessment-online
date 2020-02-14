import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';

import {AbstractControl, FormBuilder, ValidatorFn, Validators} from '@angular/forms';
import {textMasks} from '../../../../controls/text-masks/text-masks';
import {Usuario} from '@src/sistema/domain/entity/usuario/usuario.model';
import {AuthenticationService} from '@src/sistema/domain/service/authentication.service';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';
import {FileUploader} from "ng2-file-upload";
import {TdFileUploadComponent} from "@covalent/core/file";

/**
 *
 */
@Component({
  selector: 'usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class AtendenteFormComponent implements OnInit {

  /**
   *
   */
  uploader: FileUploader;

  /**
   *
   * @type {boolean}
   */
  showPassword = false;

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
  usuario: Usuario;

  /**
   *
   */
  usuarioLogado: any;

  /**
   *
   * @param {AuthenticationService} authenticationService
   * @param {Renderer} renderer
   * @param {MatSnackBar} toastService
   * @param {FormBuilder} fb
   * @param {ElementRef} element
   */
  constructor(private authenticationService: AuthenticationService,
              private renderer: Renderer2, private toastService: ToastService,
              private fb: FormBuilder, @Inject(ElementRef) private element: ElementRef) {

    this.authenticationService.requestContaAutenticada().subscribe(result => {
      this.usuarioLogado = result;
    })
  }

  /**
   *
   */
  ngOnInit() {

    if (!this.usuario.conta || !this.usuario.conta.email || !this.usuario.conta.email.length) {
      this.showPassword = true;
    }

    this.form = this.fb.group({
      nome: ['nome', [Validators.required]],
      email: ['email', [Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'), this.emailObrigatorio()]]
    });

    this.fotoPath = this.usuario.fotoPath;
    this.arquivoFile = this.usuario.arquivoFile;
  }

  /**
   *
   * @param exception
   * @param validatorFn
   */
  public emailObrigatorio(exception?: string, validatorFn?: ValidatorFn): ValidatorFn {
    if (validatorFn) {
      return validatorFn;
    }
    return (c: AbstractControl): { [key: string]: any } => {

      if ((this.usuario.conta.administrador) && (!c.value || !c.value.length)) {
        return {
          exception: exception ? exception : 'O e-mail é obrigatório se o Item Avaliável for administrador'
        };
      }

      return null
    }
  }

  /**
   *
   */
  public saveAtendente(form: any): void {
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
      this.usuario.arquivoFile = this.arquivoFile;
      this.usuario.fotoPath = this.fotoPath;
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

  /**
   *
   */
  @ViewChild('fileUpload', {static: false})
  fileUpload: ElementRef<HTMLInputElement>;

  /**
   *
   */
  choosePhoto() {
    this.fileUpload.nativeElement.click()
  }
}
