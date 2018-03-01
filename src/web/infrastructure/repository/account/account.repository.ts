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
      // this.save( null, "1@a.com", '123456').then(result => {console.log(result)});
  }

  /**
   * 
   * @param uid
   * @param email
   * @param password
   * @returns {Promise<any>}
   */
  public save(uid, email, password): Promise<any> {

    /**
     * Url hardcoded
     */
    return this.httpClient
      .post(
        './save',
        {uid: uid, email: email, password: password}
      ).toPromise();
  }

}