import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ConfiguracaoRepository} from "../../../../../web/domain/repositories/configuracao.repository";
import {Configuracao} from "../../../../../web/domain/entity/configuracao/configuracao.model";

@Component({
  selector: 'app-conclusao',
  templateUrl: './conclusao.component.html',
  styleUrls: ['./conclusao.component.scss']
})
export class ConclusaoComponent implements OnInit {

  /**
   *
   */
  configuracao: Configuracao;

  /**
   * @param {Router} router
   * @param {ConfiguracaoRepository} configuracaoRepository
   */
  constructor(private router: Router, private configuracaoRepository: ConfiguracaoRepository) {
  }

  /**
   *
   */
  ngOnInit() {
    this.configuracaoRepository.configuracao.subscribe(configuracao =>
      this.configuracao = configuracao
    );

    setTimeout(() => {
      this.router.navigate(['/avaliar']);
    }, 5000);
  }
}
