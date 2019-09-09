import {IWrite} from '../interfaces/IWrite';
import {IRead} from '../interfaces/IRead';
import {HttpClient} from '@angular/common/http';
import {PageSerialize} from '../../page-serialize/page-serialize';
import {Observable} from 'rxjs';
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";


export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {

  protected collectionName: string = environment.endpoint;

  public socket: WebSocketSubject<T>;

  constructor(public httpClient: HttpClient, public collection: string, private router?: Router) {
    if (collection) {
      this.collectionName = this.collectionName + collection;
    } else {
      this.collectionName = this.collectionName + this.constructor.name.replace('Repository', '').toLowerCase() + 's';
    }
  }

  connect(id: number): WebSocketSubject<T> {

    this.socket = webSocket('ws://localhost:8080/' + this.collectionName + '/' + id + '/connect');

    // return new Observable<any>(subscriber => {
    return this.socket;
    // });

// return null
  }

  async save(item: T): Promise<T> {
    const aux: any = item;
    if (aux.id) {
      return this.update(aux.id, item);
    }
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

  listByFilters(pageable: any): Observable<any> {

    const params = PageSerialize.getHttpParamsFromPageable(pageable);

    // if (this.router) {
    //
    //   const queryParams = Object.assign({}, pageable);
    //   if (params.getAll('sort')) {
    //     queryParams.sort = params.getAll('sort').join();
    //   }
    //
    //   // Coloca na rota
    //   this.router.navigate([], {queryParams: queryParams})
    // }

    return this.httpClient.get(this.collectionName, {
      params: params
    })

  }

  listByIds(pageable: any): Observable<any> {

    const params = PageSerialize.getHttpParamsFromPageable(pageable);

    return this.httpClient.get(this.collectionName, {
      params: params
    })
  }

  findAll(): Observable<T[]> {
    return this.httpClient.get<T[]>(this.collectionName);
  }

  listLightByFilters(pageable): Observable<any> {

    const params = PageSerialize.getHttpParamsFromPageable(pageable);

    return this.httpClient.get<T[]>(this.collectionName + '/light', {
      params: params
    })
  }

  listByUsuarioId(pageable: any): Observable<T[]> {

    const params = PageSerialize.getHttpParamsFromPageable(pageable);

    return this.httpClient.get<T[]>(this.collectionName + '/by-usuario', {
      params: params
    })
  }
}
