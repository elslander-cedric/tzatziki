import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import * as SockJS from 'sockjs-client';

@Injectable()
export class WebSocketService {

  private ws : any; //SockJS;//WebSocket;
  private pendingRequests = [];

  constructor(private http: Http) {
    this.connect();
  }

  public connect() : void {
    // this.ws = new WebSocket(`ws://${location.host}/ws`);
    this.ws = new SockJS(`http://${location.host}/ws`);

    this.ws.onclose = (close : CloseEvent) => {
      setTimeout(() => { this.connect() }, 1000);
    }

    this.ws.onmessage = (message : MessageEvent) => {
      let data = JSON.parse(message.data);
      let observer = this.pendingRequests[data.requestId];

      if(data.err) {
        observer.error(data.err);
      } else {
        observer.next(data.result);
        observer.complete();
      }
    };
  }

  public send(data) : Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.pendingRequests[data.requestId = Math.random()] = observer;
      setTimeout(() => { observer.error("Error timeout"); }, 10000);
      this.ws.send(JSON.stringify(data));
    })
  }
}
