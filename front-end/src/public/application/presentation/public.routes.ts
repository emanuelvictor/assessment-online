import {Routes} from '@angular/router';
import {AvaliacaoComponent} from '@src/public/application/presentation/avaliacao/avaliacao.component';
import {ConclusaoViewComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/conclusao-view.component';
import {SelecionarAtendentesComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-atendentes/selecionar-atendentes.component';
import {SelecionarNotaComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota/selecionar-nota.component';
import {SelecionarNotaEItensAvaliaveisComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/selecionar-nota-e-itens-avaliaveis/selecionar-nota-e-itens-avaliaveis.component';
import {SelecionarUnidadeComponent} from '@src/public/application/presentation/avaliacao/avaliar/selecionar-unidade/selecionar-unidade.component';
import {ExecutarAvaliacaoComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/executar-avaliacao.component';
import {PublicService} from '@src/public/domain/service/public.service';
import {AvaliarComponent} from '@src/public/application/presentation/avaliacao/avaliar/avaliar.component';
import {PublicErrorComponent} from '@src/public/application/presentation/controls/public-error/public-error.component';
import {FeedbackComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/feedback/feedback.component';
import {RobotVerifyComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/robot-verify/robot-verify.component';
import {ConclusaoComponent} from '@src/public/application/presentation/avaliacao/avaliar/executar-avaliacao/conclusao/conclusao/conclusao.component';

export const routes: Routes = [
  {
    path: '', redirectTo: 'avaliar', pathMatch: 'full'
  },
  {
    path: 'avaliar', component: AvaliacaoComponent,
    children: [
      {
        path: ':numeroLicenca', component: AvaliarComponent, canActivate: [PublicService],
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
    path: 'error', component: PublicErrorComponent
  }
];
