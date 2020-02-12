import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Avaliacao} from '@src/sistema/domain/entity/avaliacao/avaliacao.model';
import {FaturaRepository} from '@src/sistema/domain/repository/fatura.repository';
import {viewAnimation} from '../../../controls/utils';
import {Fatura} from '@src/sistema/domain/entity/assinatura/fatura.model';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'visualizar-fatura',
  templateUrl: './visualizar-fatura.component.html',
  styleUrls: ['./visualizar-fatura.component.scss'],
  animations: [
    viewAnimation
  ]
})
export class VisualizarFaturaComponent implements OnInit {

  /**
   *
   * @type {Avaliacao}
   */
  fatura: Fatura = new Fatura();

  /**
   * @param toastService {MatSnackBar}
   * @param activatedRoute {ActivatedRoute}
   * @param router {Router}
   * @param dialog {MatDialog}
   * @param faturaRepository {FaturaRepository}
   */
  constructor(private faturaRepository: FaturaRepository,
              private router: Router, private dialog: MatDialog,
              private toastService: ToastService, public activatedRoute: ActivatedRoute) {
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
    this.faturaRepository.findById(id).subscribe(result => this.fatura = result)
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
