import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Avaliacao} from '../../../../../domain/entity/avaliacao/avaliacao.model';
import {FaturaRepository} from '../../../../../domain/repository/fatura.repository';
import {viewAnimation} from '../../../controls/utils';
import {Fatura} from '../../../../../domain/entity/assinatura/fatura.model';

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
   * @param snackBar {MatSnackBar}
   * @param activatedRoute {ActivatedRoute}
   * @param router {Router}
   * @param dialog {MatDialog}
   * @param faturaRepository {FaturaRepository}
   */
  constructor(private faturaRepository: FaturaRepository,
              private router: Router, private dialog: MatDialog,
              private snackBar: MatSnackBar, public activatedRoute: ActivatedRoute) {
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
    this.snackBar.open(message, 'Fechar', {
      duration: 5000
    })
  }
}
