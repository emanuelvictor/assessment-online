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
  licenca: any = new Licenca();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param unidadeTipoAvaliacaoLicencaRepository
   * @param {ActivatedRoute} activatedRoute
   * @param {LicencaRepository} licencaRepository
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   */
  constructor(private licencaRepository: LicencaRepository, private activatedRoute: ActivatedRoute,
              private unidadeTipoAvaliacaoLicencaRepository: UnidadeTipoAvaliacaoLicencaRepository,
              private domSanitizer: DomSanitizer, private snackBar: MatSnackBar, private router: Router) {

  }

  /**
   *
   */
  ngOnInit() {
    const numero: number = this.activatedRoute.snapshot.params['numero'];
    this.find(numero)
  }

  /**
   *
   * @param {number} numero
   */
  public find(numero: number) {
    this.licencaRepository.findById(numero).subscribe((licenca: Licenca) => this.licenca = licenca)
  }

  /**
   *
   */
  public save(): void {
    // delete (this.licenca as any).assinatura;
    // delete this.licenca.unidadesTiposAvaliacoesLicenca;
    // delete this.licenca.numeroSerie;
    // delete this.licenca.numero;
    // delete this.licenca.senha;
    // delete this.licenca.unidades;
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
