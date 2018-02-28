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
   * @param login
   * @param password
   * @returns {Promise<any>}
   */
  public save(login, password): Promise<any> {
    /**
     * Url hardcoded
     */
    return this.httpClient
      .post(
        './save',
        {email: login, password: password}
      ).toPromise();
  }

}