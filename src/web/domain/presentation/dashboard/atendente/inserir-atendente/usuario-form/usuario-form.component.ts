import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import 'rxjs/add/operator/toPromise';
import {FormBuilder, Validators} from "@angular/forms";
import {textMasks} from "../../../../controls/text-masks/text-masks";
import {Usuario} from '../../../../../entity/usuario/Usuario.model';
import {UsuarioService} from '../../../../../service/usuario.service';

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
   * @type {boolean}
   */
  showPassword : boolean = false;

  /**
   *
   * @type {any}
   */
  urlFile = null;

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
   * @param {MatSnackBar} snackBar
   * @param {FormBuilder} fb
   * @param {ElementRef} element
   * @param {Renderer} renderer
   * @param {UsuarioService} usuarioService
   */
  constructor(private snackBar: MatSnackBar, private fb: FormBuilder, @Inject(ElementRef) private element: ElementRef, private renderer: Renderer, private usuarioService: UsuarioService) {
    this.usuarioService.getUsuarioAutenticado().subscribe(result => {
      this.usuarioLogado = result;
    });
  }

  /**
   *
   */
  ngOnInit() {
    if (!this.usuario.email || !this.usuario.email.length)
      this.showPassword = true;

    this.form = this.fb.group({
      nome: ['nome', [Validators.required]],
      email: ['email', [Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]]
    });
    this.urlFile = this.usuario.urlFile;
    this.arquivoFile = this.usuario.arquivoFile;
  }

  /**
   *
   */
  public saveAtendente(form: any): void {
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
      this.usuario.arquivoFile = this.arquivoFile;
      this.usuario.urlFile = this.urlFile;
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
        this.urlFile = arquivo.target.result;
      };
    }
  }

  /**
   *
   */
  public removeFile() {
    this.urlFile = null;
    this.arquivoFile = null;
  }
}