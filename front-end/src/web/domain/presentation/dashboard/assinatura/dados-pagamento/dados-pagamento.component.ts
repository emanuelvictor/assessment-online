import {Component, ElementRef, Inject, Input, OnInit, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material";
import {Configuracao} from "../../../../entity/configuracao/configuracao.model";

import {TdLoadingService} from '@covalent/core';

import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {viewAnimation} from "../../../controls/utils";
import {textMasks} from "../../../controls/text-masks/text-masks";
import {Assinatura} from "../../../../entity/assinatura/assinatura.model";
import {AssinaturaRepository} from "../../../../repository/assinatura.repository";
import {obrigatorio} from "../../../controls/validators/validators";

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

    // this.form.get('secondFormGroup').addControl('codigoArea', new FormControl([obrigatorio('O código de área do número de telefone é obrigatório')]));
    // this.form.get('secondFormGroup').addControl('telefone', new FormControl([obrigatorio('O telefone é obrigatório')]))


    const formGroup = new FormGroup({
      codigoArea: new FormControl(this.assinatura.codigoArea, [obrigatorio('O código de área do número de telefone é obrigatório')]),
      telefone: new FormControl(this.assinatura.telefone, [obrigatorio('O telefone é obrigatório')]),
    });

    if (!this.form) {
      this.form = this.fb.group({});
    }

    this.form.addControl('secondFormGroup', formGroup);

    console.log(this.form)


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
            this.error(control.errors.exception);
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
                this.error(controlInner.errors.exception);
              }
              break
            }
          }
        }
      }
    }

    if (valid) {
      this._loadingService.register('overlayStarSyntax');
      this.assinaturaRepository.save(this.assinatura)
        .then(result => {
          this.assinatura = result;

          this._loadingService.resolve('overlayStarSyntax');
          this.success('Assinatura atualizada com sucesso');

        })
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
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    })
  }

}
