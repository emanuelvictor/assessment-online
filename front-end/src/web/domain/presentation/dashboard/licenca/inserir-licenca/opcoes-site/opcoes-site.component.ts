import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry, MatSnackBar} from "@angular/material";

import {AbstractControl, FormBuilder, ValidatorFn, Validators} from "@angular/forms";
import {FileRepository} from "../../../../../../infrastructure/repository/file/file.repository";
import {Licenca} from "../../../../../entity/avaliacao/licenca.model";
import {viewAnimation} from "../../../../controls/utils";

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
export class OpcoesSiteComponent {

  /**
   *
   * @type {Licenca}
   */
  @Input()
  public licenca: Licenca;

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
