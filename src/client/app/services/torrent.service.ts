import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class TorrentService {

  private ws : WebSocket;

  constructor(private http: Http) {
    this.connect();
  }

  public connect() : void {
    this.ws = new WebSocket(`ws://${location.host}/ws`);

    // TODO-FIXME : this is a workaround, to force http upgrade first %(
    this.http.get(`http://${location.host}/ws`)
      .toPromise()
      .then(() => console.log("ws http sent"))
      .catch(() => console.log("ws http error"));

    console.log("connect ws")

    this.ws.onerror = (err) => console.log(`websocket onerror ${err}`);
    this.ws.onopen = () => console.log(`websocket onopen`);

    this.ws.onclose = (close : CloseEvent) => {
      console.log(`websocket onclose`);
      setTimeout(() => { this.connect() }, 1000);
    }
  }

  public send(data) : Observable<any> {
    return Observable.create((observer: Observer<string>) => {
      this.ws.onmessage = (message : MessageEvent) => {
        console.log(`websocket onmessage: ${message}`);

        let data = JSON.parse(message.data);

        if(data.err) {
          observer.error(data.err);
        } else {
          observer.next(data.result);
        }
      };

      this.ws.send(JSON.stringify(data));
    })
  }
}
