import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MobileRoutingModule} from '@src/mobile/application/module/routing/mobile-routing.module';
import {RootViewComponent} from '@src/mobile/application/bootstrap/root-view.component';
import {HomeComponent} from '@src/mobile/application/presentation/home/home.component';


@NgModule({
  declarations: [
    HomeComponent,
    RootViewComponent,
  ],
  imports: [
    BrowserModule,
    MobileRoutingModule,
  ],
  providers: [],
  bootstrap: [RootViewComponent]
})
export class MobileModule { }
