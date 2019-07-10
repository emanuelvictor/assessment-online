import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {DomSanitizer} from "@angular/platform-browser";
import {DispositivoRepository} from "../../../../repository/dispositivo.repository";
import {Dispositivo} from "../../../../entity/avaliacao/dispositivo.model";
import {UnidadeTipoAvaliacaoDispositivoRepository} from "../../../../repository/unidade-tipo-avaliacao-dispositivo.repository";

@Component({
  selector: 'alterar-dispositivo',
  templateUrl: './alterar-dispositivo.component.html',
  styleUrls: ['./alterar-dispositivo.component.scss']
})
export class AlterarDispositivoComponent implements OnInit {

  /**
   *
   */
  masks = textMasks;

  /**
   *
   * @type {Dispositivo}
   */
  dispositivo: Dispositivo = new Dispositivo();

  /**
   *
   * @param {MatSnackBar} snackBar
   * @param unidadeTipoAvaliacaoDispositivoRepository
   * @param {ActivatedRoute} activatedRoute
   * @param {DispositivoRepository} dispositivoRepository
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   */
  constructor(private domSanitizer: DomSanitizer, private snackBar: MatSnackBar, private router: Router,
              private dispositivoRepository: DispositivoRepository, private activatedRoute: ActivatedRoute,
              private unidadeTipoAvaliacaoDispositivoRepository: UnidadeTipoAvaliacaoDispositivoRepository) {

  }

  /**
   *
   */
  ngOnInit() {
    const dispositivoId: number = this.activatedRoute.snapshot.params['id'];
    this.find(dispositivoId)
  }

  /**
   *
   * @param {number} dispositivoId
   */
  public find(dispositivoId: number) {
    this.dispositivoRepository.findById(dispositivoId).subscribe((dispositivo: Dispositivo) => this.dispositivo = dispositivo)
  }

  /**
   *
   */
  public save(): void {
    this.dispositivoRepository.save(this.dispositivo)
      .then(result => {
        this.dispositivo = result;
        this.success('Dispositivo inserido com sucesso')
      })
  }

  /**
   *
   * @param $event
   */
  add($event: any) {
    this.unidadeTipoAvaliacaoDispositivoRepository.save($event);
    console.log(this.dispositivo.unidadesTiposAvaliacoesDispositivo.length)
  }

  /**
   *
   * @param $event
   */
  remove($event: any) {
    this.unidadeTipoAvaliacaoDispositivoRepository.delete($event.id);
    console.log(this.dispositivo.unidadesTiposAvaliacoesDispositivo.length)
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
