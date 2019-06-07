import {Component, OnDestroy} from '@angular/core';

import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../../service/authentication.service';
import {ConfiguracaoRepository} from "../../../repository/configuracao.repository";
import {Configuracao} from "../../../entity/configuracao/configuracao.model";
import {Conta} from "../../../entity/usuario/conta.model";

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  /**
   *
   */
  public conta: Conta;

  /**
   *
   */
  public userSubscription: Subscription;

  /**
   *
   */
  public routerSubscription: Subscription;

  /**
   *
   */
  public configuracao: Configuracao;

  /**
   *
   * @param {AuthenticationService} authenticationService
   * @param {Router} router
   * @param {ConfiguracaoRepository} configuracaoRepository
   */
  constructor(private authenticationService: AuthenticationService,
              private router: Router, private configuracaoRepository: ConfiguracaoRepository) {
    this.configuracaoRepository.configuracao.subscribe(result => {
      this.configuracao = result;
      if (this.configuracao.logoPath)
        this.configuracao.logoPath = this.configuracao.logoPath + '?nocache=' +  Math.floor(Math.random() * 2000).toString();
    });
    this.authenticationService.requestContaAutenticada().subscribe(result => {
      this.conta = result;
    });

    this.userSubscription = authenticationService.contaAutenticadaChanged.subscribe((user) => {
      this.conta = user;
    });
  }

  /**
   *
   */
  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
  }

  /**
   *
   */
  public logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/authentication']);
  }

}
