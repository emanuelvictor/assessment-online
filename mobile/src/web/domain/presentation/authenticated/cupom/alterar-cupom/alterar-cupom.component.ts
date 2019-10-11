import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {DomSanitizer} from '@angular/platform-browser';
import {CupomRepository} from '../../../../repository/cupom.repository';
import {Cupom} from '../../../../entity/assinatura/cupom.model';

@Component({
  selector: 'alterar-cupom',
  templateUrl: './alterar-cupom.component.html',
  styleUrls: ['./alterar-cupom.component.scss']
})
export class AlterarCupomComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Cupom}
   */
  cupom: any = new Cupom();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param {ActivatedRoute} activatedRoute
   * @param {CupomRepository} cupomRepository
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   */
  constructor(private cupomRepository: CupomRepository, private activatedRoute: ActivatedRoute,
              private domSanitizer: DomSanitizer, private snackBar: MatSnackBar, private router: Router) {

  }

  /**
   *
   */
  ngOnInit() {
    const id: number = this.activatedRoute.snapshot.params['id'];
    this.find(id)
  }

  /**
   *
   * @param {number} id
   */
  public find(id: number) {
    this.cupomRepository.findById(id)
      .subscribe((cupom: Cupom) => this.cupom = cupom)
  }

  /**
   *
   */
  public save(): void {
    this.cupomRepository.save(this.cupom)
      .then(result => {
        this.cupom = result;
        this.success('Cupom alterado com sucesso')
      })
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
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    })
  }
}
