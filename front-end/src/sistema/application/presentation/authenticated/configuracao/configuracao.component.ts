import {Component, ElementRef, Inject, OnInit, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry, MatSnackBar} from '@angular/material';
import {Configuracao} from '../../../../domain/entity/configuracao/configuracao.model';

import {TdLoadingService} from '@covalent/core';

import {AbstractControl, FormBuilder, ValidatorFn, Validators} from '@angular/forms';
import {ConfiguracaoService} from '../../../../domain/service/configuracao.service';
import {FileRepository} from '../../../../infrastructure/repository/file/file.repository';
import {ConfiguracaoRepository} from '../../../../domain/repository/configuracao.repository';
import {AuthenticationService} from '../../../../domain/service/authentication.service';
import {TipoFeedback} from '../../../../domain/entity/configuracao/tipo-feedback.enum';
import {enumToArrayString, viewAnimation} from '../../controls/utils';

/**
 *
 */
@Component({
  selector: 'configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class ConfiguracaoComponent implements OnInit {

  /**
   *
   */
  contaAutenticada: any = null;

  /**
   *
   * @type {}
   */
  logoPath = null;

  /**
   *
   * @type {}
   */
  arquivoFile = null;

  /**
   *
   * @type {}
   */
  backgroundPath = null;

  /**
   *
   * @type {}
   */
  backgroundArquivoFile = null;

  /**
   *
   * @type {Configuracao}
   */
  public configuracao: Configuracao = new Configuracao();

  /**
   *
   */
  form: any;
  /**
   *
   * @type {any}
   */
  importFilePath = null;
  /**
   *
   * @type {any}
   */
  importFile = null;
  done = false;

  tiposFeedbacks: any;

  /**
   *
   * @param snackBar
   * @param fileRepository
   * @param _loadingService
   * @param element
   * @param configuracaoService
   * @param renderer
   * @param fb
   * @param authenticationService
   * @param configuracaoRepository
   * @param iconRegistry
   * @param domSanitizer
   */
  constructor(private snackBar: MatSnackBar,
              private fileRepository: FileRepository,
              private _loadingService: TdLoadingService,
              @Inject(ElementRef) private element: ElementRef,
              private configuracaoService: ConfiguracaoService,
              private renderer: Renderer, private fb: FormBuilder,
              private authenticationService: AuthenticationService,
              private configuracaoRepository: ConfiguracaoRepository,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  }

  /**
   *
   */
  ngOnInit(): void {

    this.tiposFeedbacks = enumToArrayString(TipoFeedback);

    this.form = this.fb.group({
      um: ['um', [Validators.required]],
      dois: ['dois', [Validators.required]],
      tres: ['tres', [Validators.required]],
      quatro: ['quatro', [Validators.required]],
      cinco: ['cinco', [Validators.required]],
      agradecimento: ['agradecimento', [Validators.required]],
      feedbackEnunciado: ['feedbackEnunciado', [this.feedbackRequired()]],
    });

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'meia-boca', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bacana', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'top-da-balada', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));

    this.configuracaoService.requestConfiguracao.subscribe(result => {

      this.configuracao = result;

      if (!this.configuracao.tipoFeedback) {
        this.configuracao.tipoFeedback = TipoFeedback.TEXTO;
      }

      this.logoPath = this.configuracao.logoPath;
      this.arquivoFile = this.configuracao.logoFile;

      this.backgroundPath = this.configuracao.backgroundImagePath;
      this.backgroundArquivoFile = this.configuracao.backgroundImageFile;

      this.done = true;

    });

    this.contaAutenticada = this.authenticationService.contaAutenticada;
  }


  /**
   *
   * @param exception
   */
  feedbackRequired(exception?: string): ValidatorFn {
    return (c: AbstractControl): { [key: string]: any } => {
      if (this.configuracao.feedback && !c.value) {
        return {exception: exception ? exception : 'Campo obrigatório'};
      } else {
        return null;
      }
    }
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

      this.configuracao.backgroundImageFile = this.backgroundArquivoFile;
      this.configuracao.backgroundImagePath = this.backgroundPath;

      this.configuracao.logoFile = this.arquivoFile;
      this.configuracao.logoPath = this.logoPath;

      this._loadingService.register('overlayStarSyntax');
      this.configuracaoService.save(this.configuracao)
        .then(result => {
          this.configuracao = result;

          this._loadingService.resolve('overlayStarSyntax');
          this.success('Configuração atualizada com sucesso');

          this.configuracaoRepository.observerConfiguracao.next(result);
        });
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
  public success(message: string) {
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
        this.logoPath = arquivo.target.result;
      };
    }
  }

  /**
   *
   */
  public removeFile() {
    this.logoPath = null;
    this.arquivoFile = null;
  }

  /**
   *
   * @param event
   */
  backgroundChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.backgroundArquivoFile = fileList[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (arquivo: any) => {
        this.backgroundPath = arquivo.target.result;
      };
    }
  }

  /**
   *
   */
  public removeBackgroundFile() {
    this.backgroundPath = null;
    this.backgroundArquivoFile = null;
  }

  /**
   *
   * @param event
   */
  importFileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.importFile = fileList[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (arquivo: any) => {
        this.importFilePath = arquivo.target.result;
      };
    }
  }

  /**
   *
   */
  public removeImportFile() {
    this.importFilePath = null;
    this.importFile = null;
  }

  /**
   *
   */
  public importt() {
    this.fileRepository.importt(this.importFile);
  }

}
