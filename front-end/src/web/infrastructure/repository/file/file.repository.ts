import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

/**
 *
 */
@Injectable()
export class FileRepository {

  /**
   *
   * @param {HttpClient} httpClient
   */
  constructor(private httpClient: HttpClient) {
  }

  /**
   *
   * @param {string} path
   * @returns {Observable<any>}
   */
  findOne(path: string): Promise<any> {
    return this.httpClient.get(path, {responseType: 'blob'}).toPromise()
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


  /**
   * @param {File} file
   * @returns {Promise<any>}
   */
  importt(file: File): Promise<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient
      .post("import", formData, {responseType: 'text'})
      .toPromise();

  }
}
