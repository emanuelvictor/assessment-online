import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InserirClienteComponent} from './presentation/dashboard/cliente/inserir-cliente/inserir-cliente.component';
import {WebLoginComponent} from './presentation/login/web-login/web-login.component';
import {ErrorComponent} from "./presentation/controls/error/error.component";
import {AuthenticationService} from "./service/authentication.service";


const routes: Routes = [
  {
    path: '', redirectTo: 'authentication', pathMatch: 'full'
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
    path: 'dashboard', loadChildren: '../domain/presentation/dashboard/dashboard.module#DashboardModule', canActivate: [AuthenticationService],
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
