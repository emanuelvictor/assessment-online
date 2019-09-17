import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import 'hammerjs';
import {MobileComponent} from './presentation/mobile.component';
import {CommonModule, registerLocaleData} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {MobileRoutingModule} from './mobile.routing.module';
import {DateAdapter, MatRippleModule} from '@angular/material';
import {SharedModule} from '../../shared/shared.module';
import {AuthenticationService} from '../../web/domain/service/authentication.service';
import {EnderecoService} from '../../web/domain/service/endereco.service';
import {UsuarioService} from '../../web/domain/service/usuario.service';
import {UnidadeService} from '../../web/domain/service/unidade.service';
import {AvaliarComponent} from './presentation/avaliacao/avaliar/avaliar.component';
import {AvaliacaoComponent} from './presentation/avaliacao/avaliacao.component';
import {ConclusaoComponent} from './presentation/avaliacao/avaliar/executar-avaliacao/conclusao/conclusao.component';
import {AvaliacaoService} from '../../web/domain/service/avaliacao.service';
import {FileRepository} from '../../web/infrastructure/repository/file/file.repository';
import {MatGridListModule} from '@angular/material/grid-list';
import {EllipsisModule} from 'ngx-ellipsis';
import {AvaliacaoRepository} from '../../web/domain/repository/avaliacao.repository';
import {UsuarioRepository} from '../../web/domain/repository/usuario.repository';
import {AvaliacaoAvaliavelRepository} from '../../web/domain/repository/avaliacao-avaliavel-repository.service';
import {EnderecoRepository} from '../../web/domain/repository/endereco.repository';
import {UnidadeRepository} from '../../web/domain/repository/unidade.repository';
import {ContaRepository} from '../../web/domain/repository/conta.repository';
import {ContaService} from '../../web/domain/service/conta.service';
import {PageSerialize} from '../../web/infrastructure/page-serialize/page-serialize';
import {MobileService} from "./service/mobile.service";
import {MobileLoginComponent} from './presentation/login/mobile-login/mobile-login.component';
import {ConfiguracaoRepository} from "../../web/domain/repository/configuracao.repository";
import {ConfiguracaoService} from "../../web/domain/service/configuracao.service";
import {LocalStorage} from "../../web/infrastructure/local-storage/local-storage";
import {CookieService} from "ngx-cookie-service";
import localePt from "@angular/common/locales/pt";
import {OperadorRepository} from "../../web/domain/repository/operador.repository";
import {UnidadeTipoAvaliacaoRepository} from "../../web/domain/repository/unidade-tipo-avaliacao.repository";
import {AvaliavelRepository} from "../../web/domain/repository/avaliavel.repository";
import {Interceptor} from "../../web/application/interceptor/interceptor";
import {SelecionarUnidadeComponent} from "./presentation/avaliacao/avaliar/selecionar-unidade/selecionar-unidade.component";
import {SelecionarAtendentesComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-atendentes/selecionar-atendentes.component";
import {SelecionarNotaComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota/selecionar-nota.component";
import {AgrupadorRepository} from "./repository/agrupador.repository";
import {SelecionarNotaEItensAvaliaveisComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota-e-itens-avaliaveis.component";
import {ExecutarAvaliacaoComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/executar-avaliacao.component";
import {FeedbackComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/feedback/feedback.component";
import {AuthenticateComponent} from "./presentation/avaliacao/configurar/configuracoes/authenticate/authenticate.component";
import {ConfiguracoesComponent} from "./presentation/avaliacao/configurar/configuracoes/configuracoes.component";
import {OpcoesDeConfiguracaoComponent} from "./presentation/avaliacao/configurar/configuracoes/opcoes-de-configuracao/opcoes-de-configuracao.component";
import {ConfigurarUnidadesEAvaliacoesComponent} from "./presentation/avaliacao/configurar/configurar-unidades-e-avaliacoes.component";
import {OrderModule} from "ngx-order-pipe";
import {DispositivoRepository} from "../../web/domain/repository/dispositivo.repository";


/**
 *
 */
@NgModule({
  declarations: [
    MobileComponent,
    AvaliarComponent,
    ConclusaoComponent,
    AvaliacaoComponent,
    SelecionarNotaComponent,
    ExecutarAvaliacaoComponent,
    SelecionarUnidadeComponent,
    SelecionarAtendentesComponent,
    SelecionarNotaEItensAvaliaveisComponent,
    MobileLoginComponent,
    FeedbackComponent,
    AuthenticateComponent,
    ConfiguracoesComponent,
    OpcoesDeConfiguracaoComponent,
    ConfigurarUnidadesEAvaliacoesComponent
  ],
  imports: [
    EllipsisModule,
    MatRippleModule,
    MatGridListModule,
    SharedModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MobileRoutingModule,
    OrderModule
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

    AuthenticationService,
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
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [MobileComponent]
})
export class MobileModule {
  constructor(public dateAdapter: DateAdapter<Date>) {
    registerLocaleData(localePt);
    dateAdapter.setLocale('pt-BR');
  }
}
