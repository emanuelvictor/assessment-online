import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "../../web/domain/presentation/login/login.component";
import {InserirEntradaMobileComponent} from "./presentation/entrada/inserir-entrada-mobile.component";
import {EntradaInseridaComponent} from "./presentation/entrada/entrada-inserida/entrada-inserida.component";
import {AuthGuard} from "../../web/domain/service/auth-guard.service";


const routes: Routes = [
  {path: '', redirectTo: 'entrada', pathMatch: 'full'},
  {
    path: 'authentication', component: LoginComponent,
  },
  {
    path: 'entrada', component: InserirEntradaMobileComponent, canActivate: [AuthGuard],
  },
  {
    path: 'entrada/inserida', component: EntradaInseridaComponent, canActivate: [AuthGuard],
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
export class MobileRoutingModule {
}