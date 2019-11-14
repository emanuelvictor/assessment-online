import {Component, ElementRef, Inject, Input, OnInit, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry, MatSnackBar} from '@angular/material';

import {FormBuilder} from '@angular/forms';
import {FileRepository} from '../../../../../../infrastructure/repository/file/file.repository';
import {viewAnimation} from '../../../../controls/utils';
import {Dispositivo} from '../../../../../../domain/entity/avaliacao/dispositivo.model';
import {environment} from '@src/environments/environment';

/**
 *
 */
@Component({
  selector: 'opcoes-site',
  templateUrl: './opcoes-site.component.html',
  styleUrls: ['./opcoes-site.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class OpcoesSiteComponent implements OnInit {

  /**
   *
   * @type {Dispositivo}
   */
  @Input()
  public dispositivo: Dispositivo;

  /**
   *
   */
  public url: string = null;

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

  /**
   *
   */
  ngOnInit(): void {
    if (environment.production) {
      this.url = window.location.origin + '/public/#/avaliar/' + this.dispositivo.id;
    } else {
      this.url = 'http://localhost:9001/#/avaliar/' + this.dispositivo.id
    }
  }

}
