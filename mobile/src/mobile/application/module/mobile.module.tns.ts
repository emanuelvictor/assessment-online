import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {NativeScriptModule} from 'nativescript-angular/nativescript.module';

import {RootViewComponent} from '@src/mobile/application/presentation/root-view.component';
import {MobileRoutingModule} from '@src/mobile/application/module/routing/mobile-routing.module';
import {HomeComponent} from '@src/mobile/application/presentation/home/home.component';


// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

@NgModule({
  declarations: [
    RootViewComponent,
    HomeComponent,
  ],
  imports: [
    NativeScriptModule,
    MobileRoutingModule,
  ],
  providers: [],
  bootstrap: [RootViewComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MobileModule { }
