import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {DomSanitizer} from "@angular/platform-browser";
import {LicencaRepository} from "../../../../repository/licenca.repository";
import {Licenca} from "../../../../entity/avaliacao/licenca.model";
import {UnidadeTipoAvaliacaoLicencaRepository} from "../../../../repository/unidade-tipo-avaliacao-licenca.repository";

@Component({
  selector: 'alterar-licenca',
  templateUrl: './alterar-licenca.component.html',
  styleUrls: ['./alterar-licenca.component.scss']
})
export class AlterarLicencaComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Licenca}
   */
  licenca: Licenca = new Licenca();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param unidadeTipoAvaliacaoLicencaRepository
   * @param {ActivatedRoute} activatedRoute
   * @param {LicencaRepository} licencaRepository
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   */
  constructor(private domSanitizer: DomSanitizer, private snackBar: MatSnackBar, private router: Router,
              private licencaRepository: LicencaRepository, private activatedRoute: ActivatedRoute,
              private unidadeTipoAvaliacaoLicencaRepository: UnidadeTipoAvaliacaoLicencaRepository) {

  }

  /**
   *
   */
  ngOnInit() {
    const licencaId: number = this.activatedRoute.snapshot.params['id'];
    this.find(licencaId)
  }

  /**
   *
   * @param {number} licencaId
   */
  public find(licencaId: number) {
    this.licencaRepository.findById(licencaId).subscribe((licenca: Licenca) => this.licenca = licenca)
  }

  /**
   *
   */
  public save(): void {
    this.licencaRepository.save(this.licenca)
      .then(result => {
        this.licenca = result;
        this.success('Licenca inserido com sucesso')
      })
  }

  /**
   *
   * @param $event
   */
  add($event: any) {
    this.unidadeTipoAvaliacaoLicencaRepository.save($event);
    console.log(this.licenca.unidadesTiposAvaliacoesLicenca.length)
  }

  /**
   *
   * @param $event
   */
  remove($event: any) {
    this.unidadeTipoAvaliacaoLicencaRepository.delete($event.id);
    console.log(this.licenca.unidadesTiposAvaliacoesLicenca.length)
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
