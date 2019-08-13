import {Injectable} from '@angular/core';
import {BaseRepository} from '../../infrastructure/repository/base/base.repository';
import {HttpClient} from '@angular/common/http';
import {TipoAvaliacao} from "../entity/avaliacao/tipo-avaliacao.model";

import * as SockJS from "sockjs-client";
import {Client, Frame, Message, over} from "stompjs";
import {Subject} from "rxjs";
import {Observable} from "rxjs/src/internal/Observable";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
// import { WebSocketSubject, webSocket } from 'rxjs/websocket';

@Injectable()
export class TipoAvaliacaoRepository extends BaseRepository<TipoAvaliacao> {


  public socket: WebSocketSubject<Message>;

  constructor(httpClient: HttpClient) {
    super(httpClient, 'tipos-avaliacoes');
  }

  connect(tipoAvaliacaoId: number): WebSocketSubject<any> {

    this.socket = webSocket('ws://localhost:8080/websocket/chat');

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
