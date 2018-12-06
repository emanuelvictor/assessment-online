import {Injectable} from '@angular/core';
import {TOKEN_NAME} from "../../domain/presentation/controls/utils";

@Injectable()
export class TokenStorage {

  get token() {
    return window.localStorage[TOKEN_NAME];
  }

  set token(token) {
    window.localStorage[TOKEN_NAME] = token;
  }

  destroy() {
    window.localStorage.removeItem(TOKEN_NAME);
  }

}