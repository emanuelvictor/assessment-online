import {LOCALE_ID, NgModule} from '@angular/core';
import 'hammerjs';
import {AuthenticationService} from './service/authentication.service';
import {DateAdapter, MatCardModule, MatCheckboxModule, MatDividerModule, MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule, MatTooltipModule} from '@angular/material';
import {EnderecoService} from './service/endereco.service';
import {UsuarioService} from './service/usuario.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {Interceptor} from '../application/interceptor/interceptor';
import {WebRoutingModule} from './web.routing.module';
import {CommonModule, registerLocaleData} from '@angular/common';
import {UnidadeService} from './service/unidade.service';
import {FileRepository} from '../infrastructure/repository/file/file.repository';
import {AvaliacaoService} from './service/avaliacao.service';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import localePt from '@angular/common/locales/pt';
import {UsuarioRepository} from './repository/usuario.repository';
import {UnidadeRepository} from './repository/unidade.repository';
import {EnderecoRepository} from './repository/endereco.repository';
import {AvaliacaoRepository} from './repository/avaliacao.repository';
import {OperadorRepository} from './repository/operador.repository';
import {AvaliacaoAvaliavelRepository} from './repository/avaliacao-avaliavel-repository.service';
import {ContaRepository} from './repository/conta.repository';
import {ContaService} from './service/conta.service';
import {PageSerialize} from '../infrastructure/page-serialize/page-serialize';
import {ConfiguracaoRepository} from "./repository/configuracao.repository";
import {ConfiguracaoService} from "./service/configuracao.service";
import {LocalStorage} from "../infrastructure/local-storage/local-storage";
import {CookieService} from "ngx-cookie-service";
import {TipoAvaliacaoRepository} from "./repository/tipo-avaliacao.repository";
import {UnidadeTipoAvaliacaoRepository} from "./repository/unidade-tipo-avaliacao.repository";
import {AvaliavelRepository} from "./repository/avaliavel.repository";
import {RecaptchaModule} from "ng-recaptcha";
import {DispositivoRepository} from "./repository/dispositivo.repository";
import {OrderModule} from "ngx-order-pipe";
import {UnidadeTipoAvaliacaoDispositivoRepository} from "./repository/unidade-tipo-avaliacao-dispositivo.repository";
import {AssinaturaRepository} from "./repository/assinatura.repository";
import {PlanoRepository} from "./repository/plano.repository";
import {FaturaRepository} from "./repository/fatura.repository";
import {CupomRepository} from "./repository/cupom.repository";
import {WebComponent} from "./presentation/web.component";
import {CovalentFileModule, CovalentLoadingModule} from "@covalent/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WebSharedModule} from "./web.shared.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";

registerLocaleData(localePt, 'pt-BR');

/**
 *
 */
@NgModule({
  declarations: [
    // Bootstrap
    WebComponent,

    // FotoLoadingComponent,

  ],
  imports: [
    WebSharedModule,
    BrowserAnimationsModule,
    BrowserModule,

    FormsModule,
    ReactiveFormsModule,
    CommonModule,

    WebRoutingModule,

    OrderModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatInputModule,
    CovalentLoadingModule,
    MatDividerModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxChartsModule,
    RecaptchaModule,
    MatIconModule,
    CovalentFileModule,
    MatCardModule,

  ],
  entryComponents: [],
  providers: [

    PageSerialize,

    UnidadeTipoAvaliacaoDispositivoRepository,
    UnidadeTipoAvaliacaoRepository,
    AvaliacaoAvaliavelRepository,
    TipoAvaliacaoRepository,
    ConfiguracaoRepository,
    AssinaturaRepository,
    AvaliavelRepository,
    AvaliacaoRepository,
    OperadorRepository,
    EnderecoRepository,
    UnidadeRepository,
    UsuarioRepository,
    FaturaRepository,
    CupomRepository,
    DispositivoRepository,
    ContaRepository,
    PlanoRepository,
    FileRepository,

    AuthenticationService,
    ConfiguracaoService,
    AvaliacaoService,
    EnderecoService,
    UsuarioService,
    UnidadeService,
    CookieService,
    LocalStorage,
    ContaService,

    {provide: LOCALE_ID, useValue: 'pt-BR'},

    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
  ],
  bootstrap: [WebComponent]
})
export class WebModule {
  constructor(public dateAdapter: DateAdapter<Date>) {
    registerLocaleData(localePt);
    dateAdapter.setLocale('pt-BR');
  }
}
