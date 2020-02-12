import {Component, ElementRef, Inject, OnInit, Renderer2} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from '@angular/platform-browser';
import {Configuracao} from '../../../../domain/entity/configuracao/configuracao.model';

import {viewAnimation} from '../../controls/utils';
import {textMasks} from '../../controls/text-masks/text-masks';
import {Assinatura} from '../../../../domain/entity/assinatura/assinatura.model';
import {AssinaturaRepository} from '../../../../domain/repository/assinatura.repository';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Endereco} from '../../../../domain/entity/endereco/endereco.model';
import {Cidade} from '../../../../domain/entity/endereco/cidade.model';
import {environment} from '@src/environments/environment';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';
import {TdLoadingService} from "@covalent/core/loading";

/**
 *
 */
@Component({
  selector: 'assinatura',
  templateUrl: './assinatura.component.html',
  styleUrls: ['./assinatura.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class AssinaturaComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Configuracao}
   */
  public assinatura: Assinatura = new Assinatura();

  /**
   *
   */
  form: FormGroup = new FormGroup({
    firstFormGroup: new FormGroup({}),
    thirdFormGroup: new FormGroup({})
  });

  /**
   *
   */
  public publicKey: string;

  /**
   *
   */
  bigCheckPath = environment.endpoint + 'assets/images/big-check.png';

  /**
   *
   * @param toastService
   * @param _loadingService
   * @param element
   * @param renderer
   * @param fb
   * @param assinaturaRepository
   * @param domSanitizer
   */
  constructor(private toastService: ToastService,
              private domSanitizer: DomSanitizer,
              private _loadingService: TdLoadingService,
              @Inject(ElementRef) private element: ElementRef,
              private assinaturaRepository: AssinaturaRepository,
              private renderer: Renderer2, private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit(): void {

    this.assinaturaRepository.assinatura.subscribe(result => {
      this.assinatura = result;
      if (!this.assinatura.endereco) {
        this.assinatura.endereco = new Endereco('', '', '', '', '', new Cidade(), 0, 0);
      }
      if (!this.assinatura.formaPagamento) {
        this.assinatura.formaPagamento = 'CARTAO'
      }
    });

    this.assinaturaRepository.publicKey.subscribe(result => this.publicKey = result)

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
          });
        } else {
          controls.push(control)
        }
      }
    });

    for (const control of controls) {
      if (control) {
        const element = this.element.nativeElement.querySelector(control.key);
        if (element && control.invalid) {
          // this.renderer.invokeElementMethod(element, 'focus', []); TODO
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
              // this.renderer.invokeElementMethod(elementt, 'focus', []); TODO
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
    this.toastService.open(message, 'Fechar', {
      duration: 5000
    })
  }
}
