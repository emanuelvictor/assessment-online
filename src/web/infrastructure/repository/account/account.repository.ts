import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

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
    return this.httpClient.post('asdfasdf',
      {'email': login, 'password': password}
    ).toPromise();
  }

}