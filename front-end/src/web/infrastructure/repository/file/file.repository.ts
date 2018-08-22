import {Injectable} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

/**
 *
 */
@Injectable()
export class FileRepository {

  /**
   *
   * @param {AngularFireStorage} storage
   */
  constructor(private httpClient: HttpClient, private storage: AngularFireStorage) {
  }

  /**
   *
   * @param {string} path
   * @returns {Observable<any>}
   */
  findOne(path: string): Observable<any> {
    return this.httpClient.get(path);
  }

  /**
   *
   * @param {string} path
   * @param {File} file
   * @returns {Promise<any>}
   */
  save(path: string, file: File): Promise<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient
      .post(path, formData, {responseType: 'text'})
      .toPromise();

  }

  /**
   *
   * @param {string} path
   */
  remove(path: string): Promise<boolean> {
    return this.httpClient
      .delete<boolean>(path)
      .toPromise();
  }
}