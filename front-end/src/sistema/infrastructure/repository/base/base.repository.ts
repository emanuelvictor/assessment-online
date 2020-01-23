import {IWrite} from '../interfaces/IWrite';
import {IRead} from '../interfaces/IRead';
import {HttpClient} from '@angular/common/http';
import {PageSerialize} from '../../page-serialize/page-serialize';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {environment} from '@src/environments/environment';


export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {

  public socket: WebSocketSubject<T>;
  protected collectionNameWebSocket: string = environment.endpointWebSocket;
  protected collectionName: string = environment.endpoint;

  constructor(public httpClient: HttpClient, public collection: string, private router?: Router) {
    if (collection) {
      this.collectionName = this.collectionName + collection;
      this.collectionNameWebSocket = this.collectionNameWebSocket + collection;
    } else {
      this.collectionName = this.collectionName + this.constructor.name.replace('Repository', '').toLowerCase() + 's';
      this.collectionNameWebSocket = this.collectionNameWebSocket + this.constructor.name.replace('Repository', '').toLowerCase() + 's';
    }
  }

  /**
   *
   * @param id
   */
  ws(id: number): WebSocketSubject<T> {

    this.socket = webSocket(this.collectionNameWebSocket + '/' + id);

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
