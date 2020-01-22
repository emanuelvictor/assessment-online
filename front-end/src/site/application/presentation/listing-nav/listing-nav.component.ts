import {Component} from '@angular/core';
import {PlanoRepository} from '@src/sistema/domain/repository/plano.repository';
import {Plano} from '@src/sistema/domain/entity/assinatura/plano.model';

@Component({
  selector: 'listing-nav',
  templateUrl: './listing-nav.component.html',
  styleUrls: ['./listing-nav.component.scss']
})
export class ListingNavComponent {

  /**
   *
   */
  planos: Plano[];

  /**
   *
   * @param planoRepository
   */
  constructor(private planoRepository: PlanoRepository) {
    planoRepository.findAll().subscribe(result => {
      this.planos = result;
    })
  }

}
