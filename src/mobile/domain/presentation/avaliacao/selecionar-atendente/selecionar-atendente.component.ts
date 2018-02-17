import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AvaliacaoService} from '../AvaliacaoService';
import {AngularFireDatabase} from 'angularfire2/database';
import {MatSnackBar} from '@angular/material';
import {SnackBarService} from '../snackbar-service/SnackBarService';

@Component({
  selector: 'app-selecionar-atendente',
  templateUrl: './selecionar-atendente.component.html',
  styleUrls: ['./selecionar-atendente.component.scss']
})
export class SelecionarAtendenteComponent implements OnInit {

  /**
   * @type {Array}
   */
  atendentes: any[] = [];

  /**
   *
   * @param {Router} router
   * @param {AvaliacaoService} avaliacaoService
   * @param {AngularFireDatabase} angularFire
   * @param {MatSnackBar} snackBar
   * @param {SnackBarService} snackBarService
   */
  constructor(private router: Router, private avaliacaoService: AvaliacaoService, private angularFire: AngularFireDatabase, private snackBar: MatSnackBar, private snackBarService: SnackBarService) {
    // this.angularFire.list('/atendentes', {preserveSnapshot: true})
    //   .subscribe(snapshots => {
    //     // Zera o array para popular novamente 'do zero'
    //     this.atendentes = [];
    //     snapshots.forEach(snapshot => {
    //       if (avaliacaoService.getUnidade().$key === snapshot.val().unidade.key) {
    //         let atendente: any;
    //         atendente = snapshot.val();
    //         atendente.key = snapshot.key;
    //         this.atendentes.push(atendente);
    //       }
    //     });
    //   })
  }

  /**
   *
   */
  ngOnInit() {
  }

  /**
   *
   */
  public concluir() {
    this.atendentes.forEach(atendente => {
      if (atendente.selected) {
        this.avaliacaoService.addAtendente(atendente);
      }
    });

    /**
     *
     */
    if (this.avaliacaoService.getAtendentes().length > 0) {
      this.avaliacaoService.enviarAvaliacao();
      this.router.navigate(['conclusao']);
    } else {
      this.snackBar.open('Selecione ao menos um atendente', 'Fechar', this.snackBarService.getSnackBarConfig());
    }
  }
}
