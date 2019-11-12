import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InserirClienteComponent} from './authenticated/cliente/inserir-cliente/inserir-cliente.component';
import {WebLoginComponent} from './login/web-login/web-login.component';
import {ErrorComponent} from './controls/error/error.component';
import {AuthenticationService} from '@src/sistema/domain/service/authentication.service';


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
    path: 'authenticated', loadChildren: '../presentation/authenticated/authenticated.module#AuthenticatedModule', canActivate: [AuthenticationService],
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
export class SistemaRoutingModule {
}
