import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {environment} from '@src/environments/environment';
import {MobileModule} from '@src/mobile/application/module/mobile.module';


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(MobileModule)
  .catch(err => console.log(err));
