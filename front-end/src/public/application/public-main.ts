import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {environment} from '@src/environments/environment';
import {PublicModule} from '@src/public/application/presentation/public.module';


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(PublicModule).catch(err => console.log(err));
