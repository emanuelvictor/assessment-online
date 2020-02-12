import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer2} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from '@angular/platform-browser';

import {FormBuilder, Validators} from '@angular/forms';
import {FileRepository} from '@src/sistema/infrastructure/repository/file/file.repository';
import {TipoAvaliacao} from '@src/sistema/domain/entity/avaliacao/tipo-avaliacao.model';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';
import {MatIconRegistry} from "@angular/material/icon";

/**
 *
 */
@Component({
  selector: 'tipo-avaliacao-form',
  templateUrl: './tipo-avaliacao-form.component.html',
  styleUrls: ['./tipo-avaliacao-form.component.scss']
})
export class TipoAvaliacaoFormComponent implements OnInit {

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
   * @type {TipoAvaliacao}
   */
  @Input()
  public tipoAvaliacao: TipoAvaliacao;

  /**
   *
   * @param toastService
   * @param {FileRepository} fileRepository
   * @param {ElementRef} element
   * @param {Renderer} renderer
   * @param {FormBuilder} fb
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   */
  constructor(private toastService: ToastService,
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
      nome: ['nome', [Validators.required]],
      selecao: ['selecao', [Validators.required]],
      enunciado: ['enunciado', [Validators.required]]
    });

    this.iconRegistry.addSvgIconInNamespace('assets', 'pessimo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/pessimo.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'ruim', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/ruim.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'meia-boca', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/regular.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'bacana', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/bom.svg'));
    this.iconRegistry.addSvgIconInNamespace('assets', 'top-da-balada', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/emojis/otimo.svg'));

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
          element.focus();
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
              element.focus();
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
      this.save.emit(this.tipoAvaliacao);
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
    this.toastService.open(message, "Fechar", {
      duration: 5000
    });
  }

}
