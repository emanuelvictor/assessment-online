import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "../../web/domain/presentation/login/login.component";
import {ConclusaoComponent} from "./presentation/avaliacao/conclusao/conclusao.component";
import {SelecionarAtendenteComponent} from "./presentation/avaliacao/selecionar-atendente/selecionar-atendente.component";
import {AvaliarComponent} from "./presentation/avaliacao/avaliar/avaliar.component";
import {SelecionarUnidadeComponent} from "./presentation/avaliacao/selecionar-unidade/selecionar-unidade.component";
import {AvaliacaoComponent} from "./presentation/avaliacao/avaliacao.component";
import {AuthenticationService} from "../../web/domain/service/authentication.service";


const routes: Routes = [
  {path: 'authentication', component: LoginComponent},
  {
    path: '', component: AvaliacaoComponent, canActivate: [AuthenticationService],
    children: [
      {path: '', component: SelecionarUnidadeComponent},
      {path: 'avaliar', component: AvaliarComponent},
      {path: 'selecionar-atendentes', component: SelecionarAtendenteComponent},
      {path: 'conclusao', component: ConclusaoComponent},
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