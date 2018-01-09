import {LOCALE_ID, NgModule} from '@angular/core';
import 'hammerjs';
import {MobileComponent} from "./presentation/mobile.component";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {Interceptor} from "../../web/application/interceptor/interceptor";
import {MobileRoutingModule} from "./mobile.routing.module";
import {MatSnackBarModule} from "@angular/material";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {AuthGuard} from "../../web/domain/service/auth-guard.service";
import {AuthenticationService} from "../../web/domain/service/authentication.service";
import {EnderecoService} from "../../web/domain/service/endereco.service";
import {Describer} from "../../web/application/describer/describer";
import {AtendenteService} from "../../web/domain/service/atendente.service";

/**
 *
 */
@NgModule({
  declarations: [

    // Controls
    MobileComponent,
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
    EnderecoService,
    AtendenteService,
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
