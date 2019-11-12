import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AvaliarComponent} from '@src/public/application/presentation/avaliacao/avaliar/avaliar.component';
import {AvaliacaoComponent} from '@src/public/application/presentation/avaliacao/avaliacao.component';
import {RobotVerifyComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/robot-verify/robot-verify.component';
import {ExecutarAvaliacaoComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/executar-avaliacao.component';
import {SelecionarNotaComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota/selecionar-nota.component';
import {SelecionarUnidadeComponent} from '@src/public/application/presentation/avaliacao/avaliar/selecionar-unidade/selecionar-unidade.component';
import {DateAdapter, MatGridListModule, MatRippleModule} from '@angular/material';
import {ConclusaoViewComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/conclusao-view.component';
import {ConclusaoComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/conclusao/conclusao.component';
import {FeedbackComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/feedback/feedback.component';
import {PublicErrorComponent} from '@src/public/application/presentation/controls/public-error/public-error.component';
import {CommonModule, registerLocaleData} from '@angular/common';
import {AuthenticatedSharedModule} from '@src/sistema/application/presentation/authenticated/authenticated.shared.module';
import {SelecionarAtendentesComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-atendentes/selecionar-atendentes.component';
import {SelecionarNotaEItensAvaliaveisComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota-e-itens-avaliaveis.component';
import {EllipsisModule} from 'ngx-ellipsis';
import {RecaptchaModule} from 'ng-recaptcha';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OrderModule} from 'ngx-order-pipe';
import {UnidadeTipoAvaliacaoRepository} from '@src/sistema/domain/repository/unidade-tipo-avaliacao.repository';
import {AvaliavelRepository} from '@src/sistema/domain/repository/avaliavel.repository';
import {EnderecoRepository} from '@src/sistema/domain/repository/endereco.repository';
import {DispositivoRepository} from '@src/sistema/domain/repository/dispositivo.repository';
import {AvaliacaoService} from '@src/sistema/domain/service/avaliacao.service';
import {Interceptor} from '@src/sistema/application/interceptor/interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ContaService} from '@src/sistema/domain/service/conta.service';
import {LocalStorage} from '@src/sistema/infrastructure/local-storage/local-storage';
import {PublicService} from '@src/public/domain/service/public.service';
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
import {AgrupadorRepository} from '@src/public/domain/repository/agrupador.repository';
import {AvaliacaoRepository} from '@src/sistema/domain/repository/avaliacao.repository';
import {PageSerialize} from '@src/sistema/infrastructure/page-serialize/page-serialize';
import {AvaliacaoAvaliavelRepository} from '@src/sistema/domain/repository/avaliacao-avaliavel-repository.service';
import {ConfiguracaoRepository} from '@src/sistema/domain/repository/configuracao.repository';
import localePt from '@angular/common/locales/pt';
import {PublicRoutingModule} from '@src/public/application/presentation/public-routing.module';
import {RootViewComponent} from '@src/public/application/presentation/root-view.component';

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

    PublicErrorComponent
  ],
  imports: [
    EllipsisModule,
    MatRippleModule,
    MatGridListModule,
    AuthenticatedSharedModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    PublicRoutingModule,
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

    ConfiguracaoService,
    AvaliacaoService,
    EnderecoService,
    UsuarioService,
    UnidadeService,
    CookieService,
    PublicService,
    LocalStorage,
    ContaService,

    {provide: LOCALE_ID, useValue: 'pt-BR'},

    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [RootViewComponent]
})
export class PublicModule {
  constructor(public dateAdapter: DateAdapter<Date>) {
    registerLocaleData(localePt);
    dateAdapter.setLocale('pt-BR');
  }
}
