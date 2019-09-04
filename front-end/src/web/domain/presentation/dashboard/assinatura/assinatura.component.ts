import {Component, ElementRef, Inject, OnInit, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry, MatSnackBar} from "@angular/material";
import {Configuracao} from "../../../entity/configuracao/configuracao.model";

import {TdLoadingService} from '@covalent/core';

import {AbstractControl, FormBuilder, ValidatorFn, Validators} from "@angular/forms";
import {ConfiguracaoService} from "../../../service/configuracao.service";
import {FileRepository} from "../../../../infrastructure/repository/file/file.repository";
import {ConfiguracaoRepository} from "../../../repository/configuracao.repository";
import {AuthenticationService} from "../../../service/authentication.service";
import {TipoFeedback} from "../../../entity/configuracao/tipo-feedback.enum";
import {enumToArrayString, viewAnimation} from "../../controls/utils";
import {textMasks} from "../../controls/text-masks/text-masks";
import {Assinatura} from "../../../entity/assinatura/assinatura.model";
import {AssinaturaRepository} from "../../../repository/assinatura.repository";

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
   */
  contaAutenticada: any = null;


  /**
   *
   * @type {Configuracao}
   */
  public assinatura: Assinatura = new Assinatura();

  /**
   *
   */
  form: any;

  /**
   *
   */
  done: boolean = false;

  /**
   *
   * @param snackBar
   * @param fileRepository
   * @param _loadingService
   * @param element
   * @param renderer
   * @param fb
   * @param authenticationService
   * @param assinaturaRepository
   * @param iconRegistry
   * @param domSanitizer
   */
  constructor(private snackBar: MatSnackBar,
              private fileRepository: FileRepository,
              private _loadingService: TdLoadingService,
              @Inject(ElementRef) private element: ElementRef,
              private assinaturaRepository: AssinaturaRepository,
              private renderer: Renderer, private fb: FormBuilder,
              private authenticationService: AuthenticationService,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  }

  /**
   *
   */
  ngOnInit(): void {

    this.form = this.fb.group({
      numeroCartao: ['numeroCartao', [Validators.required]],
      mesValidade: ['mesValidade', [Validators.required]],
      anoValidade: ['anoValidade', [Validators.required]],
      codigoSeguranca: ['codigoSeguranca', [Validators.required]],
      nomeTitularCartao: ['nomeTitularCartao', [Validators.required]],
      documentoTitularCartao: ['documentoTitularCartao', [Validators.required]],
      dataNascimentoTitularCartao: ['dataNascimentoTitularCartao', [Validators.required]],
    });

    this.assinaturaRepository.assinatura.subscribe(result => {
      this.done = true;
      this.assinatura = result
    });

    this.contaAutenticada = this.authenticationService.contaAutenticada

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
          if (control.errors.exception) {
            this.error(control.errors.exception);
          }
          break;
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
              break;
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
