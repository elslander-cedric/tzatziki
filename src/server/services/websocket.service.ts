import * as ws from 'ws';

import { Server } from "http";

import { Book } from '../shared/book';
import { Config } from '../shared/config';
import { PirateBayService } from './piratebay.service';
import { TransmissionWrapper } from '../wrappers/transmission.wrapper';
import { Goodreads } from './goodreads.service';

export class WebSocketService {

  private server : ws.Server;

  constructor(
    private httpServer: Server,
    private config : Config,
    private goodreads : Goodreads,
    private piratebayService : PirateBayService,
    private transmissionwrappper : TransmissionWrapper){}

  public start() : void {
    console.log("starting ws server ...");

    this.server = new ws.Server({ server: this.httpServer });

    this.server.on('connection', (websocket : ws.WebSocket) => {
      websocket.on('message', (message) => {
        let data = JSON.parse(message);

        switch(data.action) {
          case 'search':
            this.goodreads
              .search(data.term)
              .toPromise()
              .then((result) => websocket.send(
                JSON.stringify({
                  requestId: data.requestId,
                  result: result
                })
              ))
              .catch((err) => websocket.send(
                JSON.stringify({
                  requestId: data.requestId,
                  err: err
                })
              ));

            break;

          case 'download':
            this.piratebayService
              .search(`${data.book.title} ${data.book.author}`)
              .then((results) => {
                if(results.length === 0) {
                  return Promise.reject('No torrents found');
                } else {
                  return this.transmissionwrappper
                    .add({
                      title: results[0].name,
                      url: results[0].magnetLink
                    } as Book);
                }
              })
              .then((result) => websocket.send(
                JSON.stringify({
                  requestId: data.requestId,
                  result: result
                })
              ))
              .catch((err) => websocket.send(
                JSON.stringify({
                  requestId: data.requestId,
                  err: err
                })
              ));
        }
      });
    });
  }
}
