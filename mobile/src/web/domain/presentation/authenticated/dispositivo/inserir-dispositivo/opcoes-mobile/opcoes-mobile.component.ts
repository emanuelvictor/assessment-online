import {Component, ElementRef, Inject, Input, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry, MatSnackBar} from '@angular/material';

import {FormBuilder} from '@angular/forms';
import {FileRepository} from '../../../../../../infrastructure/repository/file/file.repository';
import {Dispositivo} from '../../../../../entity/avaliacao/dispositivo.model';
import {viewAnimation} from '../../../../controls/utils';

/**
 *
 */
@Component({
  selector: 'opcoes-mobile',
  templateUrl: './opcoes-mobile.component.html',
  styleUrls: ['./opcoes-mobile.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class OpcoesMobileComponent {

  /**
   *
   * @type {Dispositivo}
   */
  @Input()
  public dispositivo: Dispositivo;

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
}
