import {Injectable} from '@angular/core';
import {AngularFireStorage} from "angularfire2/storage";

@Injectable()
export class FileRepository {

  /**
   * TODO não fica aqui
   */
  private NProgress = window['NProgress'];

  /**
   *
   * @param {AngularFireStorage} storage
   */
  constructor(private storage: AngularFireStorage) { }

  /**
   *
   * @param {string} key
   * @param {File} file
   * @returns {Promise<any>}
   */
  save(key: string, file: File) : Promise<any> {
    console.log(key);
    console.log(file);
    return this.storage.upload(key, file).then();
  }
}