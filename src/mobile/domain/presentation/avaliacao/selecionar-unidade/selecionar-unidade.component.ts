import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AvaliacaoService} from '../AvaliacaoService';
import {AngularFireDatabase} from 'angularfire2/database';
import {FirebaseListObservable} from "angularfire2/database-deprecated";

@Component({
  selector: 'app-selecionar-unidade',
  templateUrl: './selecionar-unidade.component.html',
  styleUrls: ['./selecionar-unidade.component.scss']
})
export class SelecionarUnidadeComponent implements OnInit {

  /**
   *
   */
  model: any;

  /**
   *
   */
  unidades: FirebaseListObservable<any[]>;

  /**
   *
   */
  constructor(private router: Router, private avaliacaoService: AvaliacaoService, private angularFire: AngularFireDatabase) {
    // this.unidades = this.angularFire.list('/unidades');
  }

  /**
   *
   */
  ngOnInit() {
    // this.angularFire.list('/unidades').subscribe(unidades => {
    //   this.avaliacaoService.setUnidades(unidades);
    //   if (this.avaliacaoService.getUnidade() != null) {
    //     this.router.navigate(['avaliar']);
    //   }
    // });
  }

  /**
   *
   * @param unidade
   */
  selecionar(unidade) {
    this.avaliacaoService.setUnidade(unidade);
    this.router.navigate(['avaliar']);
  }
}
