import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {enableProdMode} from "@angular/core";
import 'hammerjs';
import {environment} from "../../environments/environment";
import {MobileModule} from "../domain/mobile.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(MobileModule).catch(err => console.log(err));
