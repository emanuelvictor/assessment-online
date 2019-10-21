import {Component, ElementRef, Inject, Input, OnInit, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material';
import {Configuracao} from '../../../../../domain/entity/configuracao/configuracao.model';

import {TdLoadingService} from '@covalent/core';

import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {viewAnimation} from '../../../controls/utils';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {Assinatura} from '../../../../../domain/entity/assinatura/assinatura.model';
import {AssinaturaRepository} from '../../../../../domain/repository/assinatura.repository';
import {obrigatorio} from '../../../controls/validators/validators';

/**
 *
 */
@Component({
  selector: 'dados-pagamento',
  templateUrl: './dados-pagamento.component.html',
  styleUrls: ['./dados-pagamento.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class DadosPagamentoComponent implements OnInit {

  /**
   *
   */
  @Input()
  publicKey: string;

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Configuracao}
   */
  @Input()
  public assinatura: Assinatura = new Assinatura();

  /**
   *
   */
  @Input()
  form: any;

  /**
   *
   * @param snackBar
   * @param _loadingService
   * @param element
   * @param renderer
   * @param fb
   * @param assinaturaRepository
   * @param domSanitizer
   */
  constructor(private snackBar: MatSnackBar,
              private domSanitizer: DomSanitizer,
              private _loadingService: TdLoadingService,
              @Inject(ElementRef) private element: ElementRef,
              private assinaturaRepository: AssinaturaRepository,
              private renderer: Renderer, private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit(): void {

    const formGroup = new FormGroup({
      codigoArea: new FormControl('codigoArea', [obrigatorio('O código de área do número de telefone é obrigatório')]),
      telefone: new FormControl('telefone', [obrigatorio('O telefone é obrigatório')]),
      diaVencimentoFatura: new FormControl('diaVencimentoFatura', [obrigatorio('Qual é o dia útil para o vencimento da fatura?'), this.diaVencimentoFaturaValidator()]),
      nomeTitular: new FormControl('nomeTitular', [obrigatorio('O nome do titular é obrigatório')]),
      dataNascimentoTitular: new FormControl('dataNascimentoTitular', [this.dataNascimentoTitularValidator()])
    });

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('secondFormGroup', formGroup)

  }

  /**
   *
   */
  public save(form): void {

    let valid = true;
    const controls: any = [];
    Object.keys(form.controls).map(function (key) {
      if (form.controls[key].invalid) {
        const control = form.controls[key];
        control.key = '#' + key;
        if (control.controls) {
          Object.keys(control.controls).map(function (key2) {
            if (control.controls[key2].invalid) {
              const controlInner = control.controls[key2];
              controlInner.key = '#' + key2;
              controls.push(controlInner)
            }
          })
        } else {
          controls.push(control)
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
            this.error(control.errors.exception)
          }
          break
        }
        if (control.controls && control.invalid) {
          for (const controlInner of control.controls) {
            const elementt = this.element.nativeElement.querySelector(controlInner.key);
            if (elementt && controlInner.invalid) {
              this.renderer.invokeElementMethod(elementt, 'focus', []);
              valid = false;
              if (controlInner.errors.exception) {
                this.error(controlInner.errors.exception)
              }
              break
            }
          }
        }
      }
    }

    if (valid) {
      this.assinaturaRepository.save(this.assinatura)
        .then(result => this.assinatura = result)
    }
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message)
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message)
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    })
  }

  /**
   *
   * @param exception
   * @param validatorFn
   */
  public diaVencimentoFaturaValidator(exception?: string, validatorFn?: ValidatorFn): ValidatorFn {

    if (validatorFn) {
      return validatorFn
    }

    return (c: AbstractControl): { [key: string]: any } => {
      if (c.value) {
        if (typeof c.value === 'number') {
          if (c.value > 28 || c.value < 1) {
            return {
              exception: exception ? exception : 'O dia para o vencimento da fatura devem estar entre o dia 1 e o dia 28'
            };
          }
        }
      }

      return null
    }
  }

  /**
   *
   * @param exception
   * @param validatorFn
   */
  public dataNascimentoTitularValidator(exception?: string, validatorFn?: ValidatorFn): ValidatorFn {

    if (validatorFn) {
      return validatorFn
    }

    return (c: AbstractControl): { [key: string]: any } => {

      if (!c || !c.value) {
        return {
          exception: exception ? exception : 'Defina uma data'
        }
      }

      if (c.value.length < 8) {
        return {
          exception: 'Data inválida'
        }
      }

      return null
    }
  }

}
