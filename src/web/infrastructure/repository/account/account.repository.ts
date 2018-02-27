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
    var headers: HttpHeaders = new HttpHeaders().set('content-type', 'application/json');
    console.log(login);
    console.log(headers);
    /**
     * Url hardcoded
     */
    return this.httpClient.post( 'http://localhost:5000/assessment-online/us-central1/save',
      {email: login, password: password}, {headers : headers}
    ).toPromise();
  }

}