import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AvaliarComponent} from "./presentation/avaliacao/avaliar/avaliar.component";
import {AvaliacaoComponent} from "./presentation/avaliacao/avaliacao.component";
import {AuthenticationService} from "../../web/domain/service/authentication.service";
import {ConfigurarUnidadesEAvaliacoesComponent} from "./presentation/avaliacao/configurar/configurar-unidades-e-avaliacoes.component";
import {SelecionarUnidadeComponent} from "./presentation/avaliacao/avaliar/selecionar-unidade/selecionar-unidade.component";
import {ConclusaoComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/conclusao/conclusao.component";
import {FeedbackComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/feedback/feedback.component";
import {SelecionarNotaComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota/selecionar-nota.component";
import {SelecionarAtendentesComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-atendentes/selecionar-atendentes.component";
import {SelecionarNotaEItensAvaliaveisComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota-e-itens-avaliaveis.component";
import {ExecutarAvaliacaoComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/executar-avaliacao.component";
import {ErrorComponent} from "./presentation/error/error.component";
import {MobileLoginComponent} from "./presentation/login/mobile-login/mobile-login.component";
import {AuthenticateComponent} from "./presentation/avaliacao/configurar/configuracoes/authenticate/authenticate.component";
import {OpcoesDeConfiguracaoComponent} from "./presentation/avaliacao/configurar/configuracoes/opcoes-de-configuracao/opcoes-de-configuracao.component";
import {ConfiguracoesComponent} from "./presentation/avaliacao/configurar/configuracoes/configuracoes.component";


const routes: Routes = [
  {path: '', redirectTo: 'avaliar', pathMatch: 'full'},
  {path: 'authentication', component: MobileLoginComponent},
  {path: 'configuracoes', component: ConfiguracoesComponent,
    children: [
      {path: '', component: AuthenticateComponent},
      {path: 'opcoes-de-configuracao', component: OpcoesDeConfiguracaoComponent},
    ]
  },
  {
    path: '', component: AvaliacaoComponent, canActivate: [AuthenticationService],
    children: [
      {path: 'configurar-unidades-e-avaliacoes', component: ConfigurarUnidadesEAvaliacoesComponent},
      {
        path: 'avaliar', component: AvaliarComponent,
        children: [
          {path: '', component: SelecionarUnidadeComponent},
          {
            path: ':unidadeId', component: ExecutarAvaliacaoComponent,
            children: [
              {
                path: 'ordem/:ordem', component: SelecionarNotaEItensAvaliaveisComponent,
                children: [
                  {path: '', component: SelecionarNotaComponent},
                  {path: 'selecionar-atendentes', component: SelecionarAtendentesComponent},
                ]
              },
              {path: 'conclusao', component: ConclusaoComponent},
              {path: 'feedback', component: FeedbackComponent},
            ]
          },
        ]
      },
    ]
  },
  {path: 'error', component: ErrorComponent}
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
