import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

/**
 *
 */
@Injectable()
export class AccountRepository {


  /**
   *
   * @param {HttpClient} httpClient
   */
  constructor(private httpClient: HttpClient) {
  }

  /**
   *
   * @param uid
   * @param email
   * @param password
   * @param photoURL
   * @param displayName
   * @returns {Promise<any>}
   */
  public handlerUser(uid, email, password, photoURL, displayName): Promise<any> {

    /**
     * Url hardcoded
     */
    return this.httpClient
      .post(
        './handlerUser',
        {uid: uid, email: email, password: password, photoURL: photoURL, displayName: displayName}
      ).toPromise();
  }

}