import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "../../web/domain/presentation/login/login.component";
import {ConclusaoComponent} from "./presentation/avaliacao/conclusao/conclusao.component";
import {AvaliarComponent} from "./presentation/avaliacao/avaliar/avaliar.component";
import {SelecionarUnidadeComponent} from "./presentation/avaliacao/selecionar-unidade/selecionar-unidade.component";
import {AvaliacaoComponent} from "./presentation/avaliacao/avaliacao.component";
import {AuthenticationService} from "../../web/domain/service/authentication.service";
import {SelecionarAtendentesComponent} from "./presentation/avaliacao/selecionar-atendentes/selecionar-atendentes.component";
import {LogoutComponent} from "./presentation/avaliacao/logout/logout.component";


const routes: Routes = [
  {
    path: '', redirectTo: 'avaliar', pathMatch: 'full'
  },
  {
    path: 'authentication', component: LoginComponent
  },
  {
    path: '', component: AvaliacaoComponent, canActivate: [AuthenticationService],
    children: [
      {path: 'selecionar-unidade', component: SelecionarUnidadeComponent},
      {path: 'avaliar', component: AvaliarComponent},
      {path: 'selecionar-atendentes', component: SelecionarAtendentesComponent},
      {path: 'conclusao', component: ConclusaoComponent},
      {path: 'logout', component: LogoutComponent},
    ]
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