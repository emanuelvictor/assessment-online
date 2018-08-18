import {IWrite} from '../interfaces/IWrite';
import {IRead} from '../interfaces/IRead';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Describer} from '../../../infrastructure/describer/describer';
import {Type} from "@angular/compiler/src/core";


export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {

  private collectionName: string;

  constructor(public httpClient: HttpClient, public collection: string) {
    if (collection) {
      this.collectionName = collection;
    } else
      this.collectionName = this.constructor.name.replace('Repository', '').toLowerCase() + 's';
  }

  async save(item: T): Promise<T> {
    return this.httpClient.post<T>(this.collectionName, item).toPromise();
  }

  update(id: number, item: T): Promise<T> {
    return this.httpClient.put<T>(this.collectionName + '/' + id, item).toPromise();
  }

  delete(id: number): Promise<void> {
    return this.httpClient.delete<void>(this.collectionName + '/' + id).toPromise();
  }

  findById(id: number): Observable<T> {
    return this.httpClient.get<T>(this.collectionName + '/' + id);
  }

  listByFilters(pageable: any): Observable<T[]> {

    let params = new HttpParams();
    params = Describer.getHttpParamsFromPageable(params, pageable);

    return this.httpClient.get<T[]>(this.collectionName, {
      params: params
    })
  }

  findAll(): Observable<T[]> {
    return this.httpClient.get<T[]>(this.collectionName);
  }

}
