import {ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {AuthenticationService} from '../../../service/authentication.service';
import {Subscription} from 'rxjs';
import {UsuarioService} from '../../../service/usuario.service';
import {ConfiguracaoRepository} from "../../../repositories/configuracao.repository";

@Component({
  selector: 'logged-root-menu',
  templateUrl: './logged-root-menu.component.html',
  styleUrls: ['./logged-root-menu.component.scss']
})
export class LoggedRootMenuComponent implements OnDestroy {

  /**
   *
   */
  authenticatedUser: any;

  /**
   *
   */
  userSubscription: Subscription;

  /**
   *
   */
  esquema: string;

  /**
   *
   * @param usuarioService
   * @param changeDetectionRef
   * @param authenticationService
   * @param configuracaoRepository
   */
  constructor(private usuarioService: UsuarioService,
              private changeDetectionRef: ChangeDetectorRef,
              private authenticationService: AuthenticationService,
              private configuracaoRepository: ConfiguracaoRepository) {

    this.configuracaoRepository.observerEsquema.subscribe(result =>
      this.esquema = result
    );

    this.authenticationService.requestContaAutenticada().subscribe(result => {
      this.authenticatedUser = result;
    });

    this.userSubscription = authenticationService.contaAutenticadaChanged.subscribe((user) => {
      this.authenticatedUser = user;
      this.changeDetectionRef.detectChanges();
    });

  }


  /**
   *
   */
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
