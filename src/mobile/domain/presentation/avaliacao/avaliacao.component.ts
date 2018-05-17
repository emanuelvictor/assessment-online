import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss']
})
export class AvaliacaoComponent implements OnInit {
  /**
   *
   */
  constructor() {
  }

  /**
   *
   */
  ngOnInit() {

    document.addEventListener("backbutton", this.onBackKeyDown, false);

  }

  onBackKeyDown() {

    alert('SAIR DO APLICATIVO');

  }

}
