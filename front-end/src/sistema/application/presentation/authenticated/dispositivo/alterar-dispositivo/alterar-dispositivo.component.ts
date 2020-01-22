import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {DomSanitizer} from '@angular/platform-browser';
import {DispositivoRepository} from '../../../../../domain/repository/dispositivo.repository';
import {Dispositivo} from '../../../../../domain/entity/avaliacao/dispositivo.model';
import {UnidadeTipoAvaliacaoDispositivoRepository} from '../../../../../domain/repository/unidade-tipo-avaliacao-dispositivo.repository';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';

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
  dispositivo: any = new Dispositivo();

  /**
   *
   * @param {ToastService} toastService
   * @param unidadeTipoAvaliacaoDispositivoRepository
   * @param {ActivatedRoute} activatedRoute
   * @param {DispositivoRepository} dispositivoRepository
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   */
  constructor(private dispositivoRepository: DispositivoRepository, private activatedRoute: ActivatedRoute,
              private unidadeTipoAvaliacaoDispositivoRepository: UnidadeTipoAvaliacaoDispositivoRepository,
              private domSanitizer: DomSanitizer, private toastService: ToastService, private router: Router) {

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
    this.dispositivoRepository.findById(id).subscribe((dispositivo: Dispositivo) => this.dispositivo = dispositivo)
  }

  /**
   *
   */
  public save(): void {
    // delete (this.dispositivo as any).assinatura;
    // delete this.dispositivo.unidadesTiposAvaliacoesDispositivo;
    // delete this.dispositivo.numeroSerie;
    // delete this.dispositivo.numero;
    // delete this.dispositivo.senha;
    // delete this.dispositivo.unidades;
    this.dispositivoRepository.save(this.dispositivo)
      .then(result => {
        this.dispositivo = result;
        this.success('Dispositivo atualizado com sucesso')
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
    this.toastService.open(message, 'Fechar', {
      duration: 5000
    })
  }
}