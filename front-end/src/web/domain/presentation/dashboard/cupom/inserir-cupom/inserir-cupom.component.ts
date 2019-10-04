import {Component, ElementRef, Inject, OnInit, Renderer} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry, MatSnackBar} from "@angular/material";

import {FormBuilder} from "@angular/forms";
import {CupomRepository} from "../../../../repository/cupom.repository";
import {ActivatedRoute, Router} from "@angular/router";
import {viewAnimation} from "../../../controls/utils";
import {Cupom} from "../../../../entity/assinatura/cupom.model";

/**
 *
 */
@Component({
  selector: 'inserir-cupom',
  templateUrl: './inserir-cupom.component.html',
  styleUrls: ['./inserir-cupom.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class InserirCupomComponent implements OnInit {

  /**
   *
   */
  public cupom: Cupom = new Cupom();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {ElementRef} element
   * @param {CupomRepository} cupomRepository
   * @param {Renderer} renderer
   * @param {FormBuilder} fb
   * @param {MatIconRegistry} iconRegistry
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   * @param {ActivatedRoute} activatedRoute
   */
  constructor(private cupomRepository: CupomRepository,
              @Inject(ElementRef) private element: ElementRef,
              private activatedRoute: ActivatedRoute, private router: Router,
              private iconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,
              private snackBar: MatSnackBar, private renderer: Renderer, private fb: FormBuilder) {
  }

  /**
   *
   */
  ngOnInit(): void {
  }

  /**
   *
   */
  public save($event): void {
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute})
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
  public openSnackBar(message: string) {
    this.snackBar.open(message, "Fechar", {
      duration: 5000
    })
  }
}
