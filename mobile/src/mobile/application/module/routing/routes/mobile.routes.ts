import {Routes} from '@angular/router';
import {HomeComponent} from '@src/mobile/application/presentation/home/home.component';
import {ConfiguracoesComponent} from '@src/mobile/application/presentation/avaliacao/configurar/configuracoes/configuracoes.component';
import {ConfigurarUnidadesEAvaliacoesComponent} from '@src/mobile/application/presentation/avaliacao/configurar/configurar-unidades-e-avaliacoes.component';
import {AuthenticateToLogoutComponent} from '@src/mobile/application/presentation/avaliacao/configurar/configuracoes/authenticate-to-logout/authenticate-to-logout.component';
import {AvaliacaoComponent} from '@src/mobile/application/presentation/avaliacao/avaliacao.component';
import {ConclusaoViewComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/conclusao-view.component';
import {SelecionarAtendentesComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-atendentes/selecionar-atendentes.component';
import {SelecionarNotaComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota/selecionar-nota.component';
import {SelecionarNotaEItensAvaliaveisComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota-e-itens-avaliaveis.component';
import {SelecionarUnidadeComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/selecionar-unidade/selecionar-unidade.component';
import {ExecutarAvaliacaoComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/executar-avaliacao.component';
import {MobileService} from '@src/mobile/domain/service/mobile.service';
import {AvaliarComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/avaliar.component';
import {MobileErrorComponent} from '@src/mobile/application/presentation/controls/mobile-error/mobile-error.component';
import {FeedbackComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/feedback/feedback.component';
import {RobotVerifyComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/robot-verify/robot-verify.component';
import {ConclusaoComponent} from '@src/mobile/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/conclusao/conclusao.component';


// export const routes: Routes = [
//   {
//     path: '',
//     redirectTo: '/home',
//     pathMatch: 'full',
//   },
//   {
//     path: 'home',
//     component: HomeComponent,
//   },
// ];


export const routes: Routes = [
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
              {
                path: 'conclusao', component: ConclusaoViewComponent,
                children: [
                  {path: '', component: ConclusaoComponent},
                  {path: 'robot-verify', component: RobotVerifyComponent},
                ]
              },
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
