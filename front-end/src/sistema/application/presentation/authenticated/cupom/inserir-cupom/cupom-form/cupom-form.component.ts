import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer2} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from '@angular/platform-browser';

import {AbstractControl, FormBuilder, ValidatorFn, Validators} from '@angular/forms';
import {FileRepository} from '@src/sistema/infrastructure/repository/file/file.repository';
import {Cupom} from '@src/sistema/domain/entity/assinatura/cupom.model';
import {ContaService} from '@src/sistema/domain/service/conta.service';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';
import {MatIconRegistry} from "@angular/material/icon";

/**
 *
 */
@Component({
  selector: 'cupom-form',
  templateUrl: './cupom-form.component.html',
  styleUrls: ['./cupom-form.component.scss']
})
export class CupomFormComponent implements OnInit {

  /**
   *
   */
  form: any;

  /**
   *
   */
  clientes: any = [];

  /**
   *
   */
  @Output()
  save: EventEmitter<any> = new EventEmitter();

  /**
   *
   * @type {Cupom}
   */
  @Input()
  public cupom: Cupom = new Cupom();

  /**
   *
   * @param {MatSnackBar} toastService
   * @param contaService
   * @param {FileRepository} fileRepository
   * @param {ElementRef} element
   * @param {Renderer} renderer
   * @param {FormBuilder} fb
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(private toastService: ToastService,
              private contaService: ContaService,
              private fileRepository: FileRepository,
              @Inject(ElementRef) private element: ElementRef,
              private renderer: Renderer2, private fb: FormBuilder,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  }

  /**
   *
   */
  ngOnInit(): void {

    this.form = this.fb.group({
      codigo: ['codigo', [Validators.required]],
      percentualDesconto: ['percentualDesconto', [this.percentualDescontoValidator()]]
    });

    this.listClientesByFilters()

  }

  /**
   * @param exception
   */
  percentualDescontoValidator(exception?: string): ValidatorFn {
    return (c: AbstractControl): { [key: string]: any } => {
      if (c.value || c.value === 0) {
        if (c.value <= 0) {
          return {exception: exception ? exception : 'O percentual deve ser maior ou igual á 0'};
        } else if (c.value > 100) {
          return {exception: exception ? exception : 'O percentual deve ser menor que 100)'};
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
    const controls: any = [];
    Object.keys(form.controls).map(function (key) {
      if (form.controls[key].invalid) {
        const control = form.controls[key];
        control.key = '#' + key;
        if (control.controls) {
          Object.keys(control.controls).map(function (keyInner) {
            if (control.controls[keyInner].invalid) {
              const controlInner = control.controls[keyInner];
              controlInner.key = '#' + keyInner;
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
          // this.renderer.invokeElementMethod(element, 'focus', []); todo
          valid = false;
          if (control.errors.exception) {
            this.error(control.errors.exception);
          }
          break;
        }
        if (control.controls && control.invalid) {
          for (const controlInner of control.controls) {
            const elementInner = this.element.nativeElement.querySelector(controlInner.key);
            if (elementInner && controlInner.invalid) {
              // this.renderer.invokeElementMethod(elementInner, 'focus', []); TODO
              valid = false;
              if (controlInner.errors.exception) {
                this.error(controlInner.errors.exception);
              }
              break
            }
          }
        }
      }
    }

    if (valid) {
      this.save.emit(this.cupom)
    }
  }

  /**
   * Consulta de usuarios
   *
   */
  public listClientesByFilters() {
    this.contaService.listByFilters({})
      .subscribe((result) => {
        this.clientes = result.content
      })
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

}
