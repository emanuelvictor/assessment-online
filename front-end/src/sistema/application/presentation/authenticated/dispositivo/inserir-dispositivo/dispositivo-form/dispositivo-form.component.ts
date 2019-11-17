import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry, MatSnackBar} from '@angular/material';

import {AbstractControl, FormBuilder, ValidatorFn, Validators} from '@angular/forms';
import {FileRepository} from '../../../../../../infrastructure/repository/file/file.repository';
import {Dispositivo} from '../../../../../../domain/entity/avaliacao/dispositivo.model';

/**
 *
 */
@Component({
  selector: 'dispositivo-form',
  templateUrl: './dispositivo-form.component.html',
  styleUrls: ['./dispositivo-form.component.scss']
})
export class DispositivoFormComponent implements OnInit {

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
   * @type {Dispositivo}
   */
  @Input()
  public dispositivo: Dispositivo = new Dispositivo();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {FileRepository} fileRepository
   * @param {ElementRef} element
   * @param {Renderer} renderer
   * @param {FormBuilder} fb
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(private snackBar: MatSnackBar,
              private fileRepository: FileRepository,
              @Inject(ElementRef) private element: ElementRef,
              private renderer: Renderer, private fb: FormBuilder,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  }

  /**
   *
   */
  ngOnInit(): void {

    this.form = this.fb.group({
      nome: ['nome', [Validators.required]],
      senha: ['senha', [this.senhaValidator()]],
      time: ['time', [Validators.required, this.timeoutValidator()]]
    });

  }

  /**
   *
   * @param exception
   */
  senhaValidator(exception?: string): ValidatorFn {
    return (c: AbstractControl): { [key: string]: any } => {
      if (c.value || c.value === 0) {
        if (c.value < 100000) {
          return {exception: exception ? exception : 'A senha deve ser maior ou igual á 100000'};
        } else if (c.value > 999999) {
          return {exception: exception ? exception : 'A senha deve ser menor ou igual á 999999'};
        }
      }

      if (!c || !c.value) {
        return {exception: exception ? exception : 'A senha é obrigatória!'};
      }
    }
  }

  /**
   *
   * @param exception
   */
  timeoutValidator(exception?: string): ValidatorFn {
    return (c: AbstractControl): { [key: string]: any } => {
      if (c.value || c.value === 0) {
        if (c.value < 5) {
          return {exception: exception ? exception : 'O tempo deve ultrapassar 5 segundos'};
        } else if (c.value > 600) {
          return {exception: exception ? exception : 'O tempo não deve ultrapassar 10 minutos (600 segundos)'};
        }
      }
    }
  }

  /**
   *
   */
  public saveForm(form): void {

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
        } else {
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
          if (control.errors.exception) {
            this.error(control.errors.exception);
          }
          break;
        }
        if (control.controls && control.invalid) {
          for (let controlInner of control.controls) {
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
      this.save.emit(this.dispositivo);
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
