import {Injectable} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';

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
   * @param {File} file
   * @returns {Promise<any>}
   */
  save(key: string, file: File): AngularFireUploadTask {
    return this.storage.upload(key, file);
  }
}