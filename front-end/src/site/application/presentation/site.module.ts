// ANGULAR
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';

import {CovalentSearchModule} from '@covalent/core/search'
import {MatExpansionModule} from '@angular/material';

import localePt from '@angular/common/locales/pt';
import {ListingNavComponent} from '@src/site/application/presentation/listing-nav/listing-nav.component';
import {LandingPageComponent} from '@src/site/application/presentation/landing-page/landing-page.component';
import {ClosedPositionsComponent} from '@src/site/application/presentation/listing-nav/closed-positions/closed-positions.component';
import {SiteRoutingModule} from './site.routing.module';
import {CadastroComponent} from '@src/site/application/presentation/cadastro/cadastro.component';
import {RecaptchaFormsModule, RecaptchaModule} from 'ng-recaptcha';
import {InProgressComponent} from '@src/site/application/presentation/listing-nav/in-progress/in-progress.component';
import {OpenPositionsComponent} from '@src/site/application/presentation/listing-nav/open-positions/open-positions.component';
import {FooterComponent} from '@src/site/application/presentation/footer/footer.component';
import {HomeViewComponent} from '@src/site/application/presentation/home/home-view.component';
import {FileRepository} from '@src/sistema/infrastructure/repository/file/file.repository';
import {UsuarioRepository} from '@src/sistema/domain/repository/usuario.repository';
import {AuthenticationService} from '@src/sistema/domain/service/authentication.service';
import {Interceptor} from '@src/sistema/application/interceptor/interceptor';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SharedModule} from '@src/site/application/presentation/shared.module';
import {SiteComponent} from './site.component';
import {LocalStorage} from '@src/sistema/infrastructure/local-storage/local-storage';
import {CookieService} from 'ngx-cookie-service';
import {FaturaRepository} from '@src/sistema/domain/repository/fatura.repository';
import {PlanoRepository} from '@src/sistema/domain/repository/plano.repository';
import {ToastService} from '@src/sistema/application/presentation/controls/toast/toast.service';

registerLocaleData(localePt, 'pt-BR');

// // Custom TranslateLoader while using AoT compilation
// export function customTranslateLoader(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// @ts-ignore
/**
 *
 */
@NgModule({
  declarations: [
    // COMPONENTS
    SiteComponent,
    HomeViewComponent,
    FooterComponent,
    LandingPageComponent,
    ListingNavComponent,
    OpenPositionsComponent,
    InProgressComponent,
    ClosedPositionsComponent,
    CadastroComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    SiteRoutingModule,
    HttpClientModule,
    CovalentSearchModule,
    MatExpansionModule,
    HttpClientJsonpModule,
    FlexLayoutModule,
    RecaptchaModule,
    RecaptchaFormsModule,

    // // Translate i18n
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: (customTranslateLoader),
    //     deps: [HttpClient]
    //   }
    // })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  entryComponents: [],
  providers: [
    FileRepository,

    // Repositories
    UsuarioRepository,

    ToastService,

    // Services
    LocalStorage,
    CookieService,
    PlanoRepository,
    FaturaRepository,
    AuthenticationService,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },

    // Internacionalizacao MatPaginator
    // { provide: MatPaginatorIntl, useValue: getPaginatorIntl() },
    {provide: LOCALE_ID, useValue: 'pt-BR'}
  ],
  bootstrap: [SiteComponent]
})
export class SiteModule {
}
