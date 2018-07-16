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
   * @param {string} key
   * @param {File} file
   * @returns {Promise<any>}
   */
  save(key: string, file: File): Promise<any> {
    console.log(file);
    // return this.httpClient.post<string>('uploads', file).toPromise();

    // const headers = new HttpHeaders({
    //   'Content-Type': 'multipart/form-data'
    // });


    const headers = new HttpHeaders({
      'Content-Disposition': 'form-data; name="file"; filename="generate.png"'
    });

    let body = new HttpParams();
    body = body.set('file', 'file');
    let vai = { 'file': file};

    return this.httpClient.post('uploads', file, {
      headers: headers
    }).toPromise();

    // return new Promise((resolve) => {
    //
    //   this.storage.upload(key, file)
    //     .then(result => {
    //       resolve(result.downloadURL)
    //     })
    // })
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