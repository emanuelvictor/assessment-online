import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {Dispositivo} from "../entity/avaliacao/dispositivo.model";
import {UnidadeTipoAvaliacaoDispositivo} from "../entity/avaliacao/unidade-tipo-avaliacao-dispositivo.model";
import * as SockJS from "sockjs-client";
import {Client, Frame, Message, over} from "stompjs";
import {Subject} from "rxjs";
import {Observable} from "rxjs/src/internal/Observable";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";

@Injectable()
export class DispositivoRepository extends BaseRepository<Dispositivo> {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'dispositivos');
  }

  public socket: WebSocketSubject<Message>;

  /**
   *
   * @param id
   * @param unidadesTiposAvaliacoesDispositivo
   */
  saveUnidadesTiposAvaliacoesDispositivo(id: number, unidadesTiposAvaliacoesDispositivo: UnidadeTipoAvaliacaoDispositivo[]): Promise<any> {
    return this.httpClient.put<any>(this.collectionName + '/' + id + '/unidadesTiposAvaliacoesDispositivo', unidadesTiposAvaliacoesDispositivo).toPromise();
  }

  connect(id: number): WebSocketSubject<any> {

    this.socket = webSocket('ws://localhost:8080/dispositivos/' + id);

    // return new Observable<any>(subscriber => {
    return this.socket;
    // });

// return null
  }

  private messageSource = new Subject<any>();

  stompClient: Client;


  private onMessage(message: Message) {
    console.log('Received greeting:', message.body);
    let json = JSON.parse(message.body);
    this.messageSource.next(json['content']);
  }
}
