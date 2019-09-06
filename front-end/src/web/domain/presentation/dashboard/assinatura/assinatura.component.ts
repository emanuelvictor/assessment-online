import {Component, ElementRef, Inject, OnInit, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material";
import {Configuracao} from "../../../entity/configuracao/configuracao.model";

import {TdLoadingService} from '@covalent/core';

import {FormBuilder, FormGroup} from "@angular/forms";
import {viewAnimation} from "../../controls/utils";
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
   * @type {Configuracao}
   */
  public assinatura: Assinatura = new Assinatura();

  /**
   *
   */
  form: FormGroup = new FormGroup({
    firstFormGroup: new FormGroup({}),
    secondFormGroup: new FormGroup({}),
    thirdFormGroup: new FormGroup({})
  });


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

    this.assinaturaRepository.assinatura.subscribe(result => {
      this.assinatura = result;
      if (!this.assinatura.formaPagamento)
        this.assinatura.formaPagamento = 'CARTAO'
    })

  }
}
