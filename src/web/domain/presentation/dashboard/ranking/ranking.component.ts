import {Component, Input, OnInit} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {calcularMedia} from '../../../entity/usuario/Usuario.model';


/**
 *
 */
@Component({
  selector: 'ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  /**
   *
   */
  @Input()
  rankeavel: any;

  /**
   *
   */
  ngOnInit(): void {
  }
}