import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import 'hammerjs';
import {MobileComponent} from "./presentation/mobile.component";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {Interceptor} from "../../web/application/interceptor/interceptor";
import {MobileRoutingModule} from "./mobile.routing.module";
import {EntradaService} from "../../web/domain/service/entrada.service";
import {MatSnackBarModule} from "@angular/material";
import {RouterModule} from "@angular/router";
import {InserirEntradaMobileComponent} from "./presentation/entrada/inserir-entrada-mobile.component";
import {EntradaFormMobileComponent} from "./presentation/entrada/entrada-form-mobile/entrada-form-mobile.component";
import {EntradaInseridaComponent} from "./presentation/entrada/entrada-inserida/entrada-inserida.component";
import {SharedModule} from "../../shared/shared.module";
import {AuthGuard} from "../../web/domain/service/auth-guard.service";
import {AuthenticationService} from "../../web/domain/service/authentication.service";
import {PontoColetaService} from "../../web/domain/service/ponto-coleta.service";
import {EnderecoService} from "../../web/domain/service/endereco.service";
import {UsuarioService} from "../../web/domain/service/usuario.service";
import {FichaService} from "../../web/domain/service/ficha.service";
import {Describer} from "../../web/application/describer/describer";

/**
 *
 */
@NgModule({
  declarations: [

    // Controls
    MobileComponent,

    // Entrada
    InserirEntradaMobileComponent,
    EntradaFormMobileComponent,
    EntradaInseridaComponent
  ],
  imports: [
    SharedModule,
    MobileRoutingModule,

    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,

    RouterModule,
    MatSnackBarModule,
  ],
  schemas: [],
  providers: [
    Describer,
    FichaService,
    EntradaService,
    UsuarioService,
    EnderecoService,
    PontoColetaService,
    AuthenticationService,

    AuthGuard,
    {provide: LOCALE_ID, useValue: "pt-BR"},

    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [MobileComponent]
})
export class MobileModule {

  constructor() {
  }
}
