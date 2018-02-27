import {Injectable} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';
import {Observable} from 'rxjs/Observable';

/**
 *
 */
@Injectable()
export class FileRepository {

  /**
   *
   * @param {AngularFireStorage} storage
   */
  constructor(private storage: AngularFireStorage) {
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
  save(key: string, file: File): AngularFireUploadTask {
    return this.storage.upload(key, file);
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