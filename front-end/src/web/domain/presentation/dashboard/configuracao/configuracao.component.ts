import {Component, ElementRef, Inject, OnInit, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry, MatSnackBar} from "@angular/material";
import {Configuracao} from "../../../entity/configuracao/configuracao.model";

import {TdLoadingService} from '@covalent/core';

import {FormBuilder, Validators} from "@angular/forms";
import {ConfiguracaoService} from "../../../service/configuracao.service";

/**
 *
 */
@Component({
  selector: 'configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.scss']
})
export class ConfiguracaoComponent implements OnInit {

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
   * @param {MatSnackBar} snackBar
   * @param {TdLoadingService} _loadingService
   * @param {ElementRef} element
   * @param {Renderer} renderer
   * @param {FormBuilder} fb
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {ConfiguracaoService} configuracaoService
   */
  constructor(private snackBar: MatSnackBar,
              private _loadingService: TdLoadingService,
              @Inject(ElementRef) private element: ElementRef,
              private configuracaoService: ConfiguracaoService,
              private renderer: Renderer, private fb: FormBuilder,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
  }

  /**
   *
   */
  ngOnInit(): void {

    this.form = this.fb.group({
      um: ['um', [Validators.required]],
      dois: ['dois', [Validators.required]],
      tres: ['tres', [Validators.required]],
      quatro: ['quatro', [Validators.required]],
      cinco: ['cinco', [Validators.required]],
      agradecimento:  ['agradecimento', [Validators.required]],
    });

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'meia-boca', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bacana', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'top-da-balada', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));

    this.configuracaoService.findAll()
      .subscribe(result => {
        if (result.length)
          this.configuracao = result[0];
      })
  }

  /**
   *
   */
  public save(form): void {

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
      this._loadingService.register('overlayStarSyntax');
      this.configuracaoService.save(this.configuracao)
        .then(result => {
          this.configuracao = result;
          this._loadingService.resolve('overlayStarSyntax');
          this.success('Configuração atualizada com sucesso');
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
    console.log(event);
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

}
