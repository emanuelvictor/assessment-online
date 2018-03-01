import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

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
   * @returns {Promise<any>}
   */
  public handlerUser(uid, email, password): Promise<any> {

    /**
     * Url hardcoded
     */
    return this.httpClient
      .post(
        './handlerUser',
        {uid: uid, email: email, password: password}
      ).toPromise();
  }

}