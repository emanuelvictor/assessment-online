import {Component, ElementRef, Inject, OnInit, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry, MatSnackBar} from "@angular/material";
import {Configuracao} from "../../../entity/configuracao/Configuracao.model";
import {ConfiguracaoRepository} from "../../../repository/configuracao.repository";

import {ActivatedRoute, Router} from '@angular/router';
import {TdLoadingService} from '@covalent/core';

import {FormBuilder, Validators} from "@angular/forms";


/**
 *
 */
@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

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
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {ConfiguracaoRepository} configuracaoRepository
   * @param {ElementRef} element
   * @param {Renderer} renderer
   * @param {FormBuilder} fb
   * @param {MatSnackBar} snackBar
   * @param {TdLoadingService} _loadingService
   */
  constructor(private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, private configuracaoRepository: ConfiguracaoRepository,
              @Inject(ElementRef) private element: ElementRef, private renderer: Renderer, private fb: FormBuilder,
              private snackBar: MatSnackBar, private _loadingService: TdLoadingService) {
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
    });

    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'terrivel', this.domSanitizer.bypassSecurityTrustResourceUrl('web-assets/emojis/terrivel.svg'));
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('web-assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'meia-boca', this.domSanitizer.bypassSecurityTrustResourceUrl('web-assets/emojis/meia-boca.svg'));
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'bacana', this.domSanitizer.bypassSecurityTrustResourceUrl('web-assets/emojis/bacana.svg'));
    this.iconRegistry.addSvgIconInNamespace('mobile-assets', 'top-da-balada', this.domSanitizer.bypassSecurityTrustResourceUrl('web-assets/emojis/top-da-balada.svg'));

    this.configuracaoRepository.find()
      .subscribe(result => {
        if (result)
          this.configuracao = result[0]
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
      this.configuracaoRepository.save(this.configuracao)
        .then(result => {
          this.configuracao = result;
          this._loadingService.resolve('overlayStarSyntax');
          this.success('Atendente inserido com sucesso');
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

}
