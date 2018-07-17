import {Injectable} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';
import {Observable} from 'rxjs/Observable';
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
   * @param {string} key
   * @returns {Observable<any>}
   */
  findOne(key: string): Observable<any> {
    return this.storage.ref(key).getDownloadURL();
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
      .post('uploads', formData)
      .toPromise();
  }

  /**
   *
   * @param {string} key
   * @returns {AngularFireUploadTask}
   */
  remove(key: string): Promise<void> {
    /**
     * Captura a exceção de not-found
     */
    return this.storage.ref(key).delete().toPromise().catch(exception => {
      console.log(exception)
    });
  }
}