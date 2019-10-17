import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InserirClienteComponent} from './presentation/authenticated/cliente/inserir-cliente/inserir-cliente.component';
import {WebLoginComponent} from './presentation/login/web-login/web-login.component';
import {ErrorComponent} from "./presentation/controls/error/error.component";
import {AuthenticationService} from './service/authentication.service';


const routes: Routes = [
  {
    path: '', redirectTo: 'authenticated/minha-conta', pathMatch: 'full'
  },
  {
    path: 'cadastre-se', component: InserirClienteComponent,
  },
  {
    path: 'authentication', component: WebLoginComponent,
  },
  {
    path: 'error', component: ErrorComponent
  },
  {
    path: 'authenticated', loadChildren: '../domain/presentation/authenticated/authenticated.module#AuthenticatedModule', canActivate: [AuthenticationService],
  }
];

/**
 *
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: []
})
export class WebRoutingModule {
}
