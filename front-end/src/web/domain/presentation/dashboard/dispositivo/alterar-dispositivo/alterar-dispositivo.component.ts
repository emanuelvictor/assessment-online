import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {textMasks} from '../../../controls/text-masks/text-masks';
import {DomSanitizer} from "@angular/platform-browser";
import {DispositivoRepository} from "../../../../repository/dispositivo.repository";
import {Dispositivo} from "../../../../entity/avaliacao/dispositivo.model";

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
   * @param {ActivatedRoute} activatedRoute
   * @param {DispositivoRepository} dispositivoRepository
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   */
  constructor(private snackBar: MatSnackBar,
              private domSanitizer: DomSanitizer,
              private dispositivoRepository: DispositivoRepository,
              private activatedRoute: ActivatedRoute, private router: Router) {

  }

  /**
   *
   */
  ngOnInit() {
    const avaliacaoId: number = this.activatedRoute.snapshot.params['id'];
    this.find(avaliacaoId);
  }

  /**
   *
   */
  public save(): void {
    this.dispositivoRepository.save(this.dispositivo)
      .then(result => {
        this.dispositivo = result;
        this.success('Tipo de avaliação inserida com sucesso')
      })
  }

  /**
   *
   * @param message
   */
  public success(message: string) {
    this.openSnackBar(message);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  /**
   *
   * @param {number} avaliacaoId
   */
  public find(avaliacaoId: number) {
    this.dispositivoRepository.findById(avaliacaoId)
      .subscribe((dispositivo: Dispositivo) => {
          this.dispositivo = dispositivo
        }
      )
  }

  /**
   *
   * @param message
   */
  public error(message: string) {
    this.openSnackBar(message);
  }

  /**
   *
   * @param message
   */
  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    });
  }
}
