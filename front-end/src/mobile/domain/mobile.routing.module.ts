import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AvaliarComponent} from "./presentation/avaliacao/avaliar/avaliar.component";
import {AvaliacaoComponent} from "./presentation/avaliacao/avaliacao.component";
import {ConfigurarUnidadesEAvaliacoesComponent} from "./presentation/avaliacao/configurar/configurar-unidades-e-avaliacoes.component";
import {SelecionarUnidadeComponent} from "./presentation/avaliacao/avaliar/selecionar-unidade/selecionar-unidade.component";
import {ConclusaoComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/conclusao/conclusao.component";
import {FeedbackComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/feedback/feedback.component";
import {SelecionarNotaComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota/selecionar-nota.component";
import {SelecionarAtendentesComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-atendentes/selecionar-atendentes.component";
import {SelecionarNotaEItensAvaliaveisComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota-e-itens-avaliaveis.component";
import {ExecutarAvaliacaoComponent} from "./presentation/avaliacao/avaliar/executar-avaliacao/executar-avaliacao.component";
import {MobileErrorComponent} from "./presentation/controls/mobile-error/mobile-error.component";
import {AuthenticateToLogoutComponent} from "./presentation/avaliacao/configurar/configuracoes/authenticate-to-logout/authenticate-to-logout.component";
import {MobileService} from "./service/mobile.service";
import {ConfiguracaoComponent} from "../../web/domain/presentation/dashboard/configuracao/configuracao.component";
import {ConfiguracoesComponent} from "./presentation/avaliacao/configurar/configuracoes/configuracoes.component";


const routes: Routes = [
  {
    path: '', redirectTo: 'configuracoes', pathMatch: 'full'
  },
  {
    path: 'configuracoes', component: ConfiguracoesComponent,
    children:
      [
        {
          path: '', component: ConfigurarUnidadesEAvaliacoesComponent
        },
        {
          path: 'authenticate', component: AuthenticateToLogoutComponent
        }
      ]
  },
  {
    path: 'avaliar', component: AvaliacaoComponent,
    children: [
      {
        path: ':numeroLicenca', component: AvaliarComponent, canActivate: [MobileService],
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
          }
        ]
      }
    ]
  },
  {
    path: 'error', component: MobileErrorComponent
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
