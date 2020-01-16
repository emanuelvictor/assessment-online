import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from '@src/site/application/presentation/landing-page/landing-page.component';
import {HomeViewComponent} from '@src/site/application/presentation/home/home-view.component';

const routes: Routes = [
  {
    path: '',
    component: HomeViewComponent,
    children: [
      {path: '', component: LandingPageComponent}
    ]
  },
];

/**
 *
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: []
})
export class SiteRoutingModule {
}
