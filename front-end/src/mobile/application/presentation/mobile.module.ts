import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MobileRoutingModule} from '@src/mobile/application/presentation/mobile-routing.module';
import {RootViewComponent} from '@src/mobile/application/presentation/root-view.component';
import {AvaliarComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/avaliar.component';
import {AvaliacaoComponent} from '@src/mobile/application/presentation/avaliacao/avaliacao.component';
import {RobotVerifyComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/robot-verify/robot-verify.component';
import {ExecutarAvaliacaoComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/executar-avaliacao.component';
import {SelecionarNotaComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota/selecionar-nota.component';
import {SelecionarUnidadeComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/selecionar-unidade/selecionar-unidade.component';
import {AuthenticateToLogoutComponent} from '@src/mobile/application/presentation/avaliacao/configurar/configuracoes/authenticate-to-logout/authenticate-to-logout.component';
import {ConclusaoViewComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/conclusao-view.component';
import {ConclusaoComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/conclusao/conclusao.component';
import {FeedbackComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/feedback/feedback.component';
import {MobileErrorComponent} from '@src/mobile/application/presentation/controls/mobile-error/mobile-error.component';
import {CommonModule, registerLocaleData} from '@angular/common';
import {AuthenticatedSharedModule} from '@src/sistema/application/presentation/authenticated/authenticated.shared.module';
import {SelecionarAtendentesComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-atendentes/selecionar-atendentes.component';
import {SelecionarNotaEItensAvaliaveisComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota-e-itens-avaliaveis.component';
import {ConfigurarUnidadesEAvaliacoesComponent} from '@src/mobile/application/presentation/avaliacao/configurar/configurar-unidades-e-avaliacoes.component';
import {EllipsisModule} from 'ngx-ellipsis';
import {ConfiguracoesComponent} from '@src/mobile/application/presentation/avaliacao/configurar/configuracoes/configuracoes.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OrderModule} from 'ngx-order-pipe';
import {UnidadeTipoAvaliacaoRepository} from '@src/sistema/domain/repository/unidade-tipo-avaliacao.repository';
import {AvaliavelRepository} from '@src/sistema/domain/repository/avaliavel.repository';
import {EnderecoRepository} from '@src/sistema/domain/repository/endereco.repository';
import {DispositivoRepository} from '@src/sistema/domain/repository/dispositivo.repository';
import {AvaliacaoService} from '@src/sistema/domain/service/avaliacao.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ContaService} from '@src/sistema/domain/service/conta.service';
import {LocalStorage} from '@src/sistema/infrastructure/local-storage/local-storage';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {CookieService} from 'ngx-cookie-service';
import {UnidadeService} from '@src/sistema/domain/service/unidade.service';
import {UsuarioService} from '@src/sistema/domain/service/usuario.service';
import {EnderecoService} from '@src/sistema/domain/service/endereco.service';
import {ConfiguracaoService} from '@src/sistema/domain/service/configuracao.service';
import {FileRepository} from '@src/sistema/infrastructure/repository/file/file.repository';
import {ContaRepository} from '@src/sistema/domain/repository/conta.repository';
import {UsuarioRepository} from '@src/sistema/domain/repository/usuario.repository';
import {UnidadeRepository} from '@src/sistema/domain/repository/unidade.repository';
import {OperadorRepository} from '@src/sistema/domain/repository/operador.repository';
import {AgrupadorRepository} from '@src/mobile/domain/repository/agrupador.repository';
import {AvaliacaoRepository} from '@src/sistema/domain/repository/avaliacao.repository';
import {PageSerialize} from '@src/sistema/infrastructure/page-serialize/page-serialize';
import {AvaliacaoAvaliavelRepository} from '@src/sistema/domain/repository/avaliacao-avaliavel-repository.service';
import {ConfiguracaoRepository} from '@src/sistema/domain/repository/configuracao.repository';
import localePt from '@angular/common/locales/pt';
import {HomeComponent} from '@src/mobile/application/presentation/home/home.component';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';
import {MobileInterceptor} from '@src/mobile/application/presentation/mobile-interceptor/mobile-interceptor';
import {DateAdapter, MatRippleModule} from "@angular/material/core";
import {MatGridListModule} from "@angular/material/grid-list";
import {RecaptchaModule} from "ng-recaptcha";

/**
 *
 */
@NgModule({
  declarations: [
    RootViewComponent,
    AvaliarComponent,
    ConclusaoViewComponent,
    ConclusaoComponent,
    RobotVerifyComponent,
    AvaliacaoComponent,
    SelecionarNotaComponent,
    ExecutarAvaliacaoComponent,
    SelecionarUnidadeComponent,
    SelecionarAtendentesComponent,
    SelecionarNotaEItensAvaliaveisComponent,
    FeedbackComponent,
    AuthenticateToLogoutComponent,
    ConfiguracoesComponent,
    ConfigurarUnidadesEAvaliacoesComponent,

    HomeComponent,

    MobileErrorComponent
  ],
  imports: [
    EllipsisModule,
    MatRippleModule,
    MatGridListModule,
    AuthenticatedSharedModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MobileRoutingModule,
    OrderModule,
    RecaptchaModule
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    PageSerialize,

    UnidadeTipoAvaliacaoRepository,
    AvaliacaoAvaliavelRepository,
    ConfiguracaoRepository,
    AvaliavelRepository,
    AvaliacaoRepository,
    AgrupadorRepository,
    OperadorRepository,
    EnderecoRepository,
    UnidadeRepository,
    UsuarioRepository,
    DispositivoRepository,
    ContaRepository,
    FileRepository,

    ToastService,

    ConfiguracaoService,
    AvaliacaoService,
    EnderecoService,
    UsuarioService,
    UnidadeService,
    CookieService,
    MobileService,
    LocalStorage,
    ContaService,

    {provide: LOCALE_ID, useValue: 'pt-BR'},

    {
      provide: HTTP_INTERCEPTORS,
      useClass: MobileInterceptor,
      multi: true
    }
  ],
  bootstrap: [RootViewComponent]
})
export class MobileModule {
  constructor(public dateAdapter: DateAdapter<Date>, toastService: ToastService) {
    registerLocaleData(localePt);
    dateAdapter.setLocale('pt-BR');
    toastService.setMobile(true);
  }
}
