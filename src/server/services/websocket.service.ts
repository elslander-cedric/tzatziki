import * as ws from 'ws';

import { Server } from "http";

import { Book } from '../shared/book';
import { Config } from '../shared/config';
import { PirateBayService } from './piratebay.service';
import { TransmissionWrapper } from '../wrappers/transmission.wrapper';
import { Goodreads } from './goodreads.service';

export class WebSocketService {

  private server : ws.Server;
  private piratebayService : PirateBayService;
  private transmissionwrappper : TransmissionWrapper;
  private goodreads : Goodreads;

  constructor(
    private httpServer: Server,
    private config : Config){
    this.piratebayService = new PirateBayService();
    this.transmissionwrappper = new TransmissionWrapper(config);
    this.goodreads = new Goodreads(config);
  }

  public start() : void {
    console.log("starting ws server ...");

    this.server = new ws.Server({ server: this.httpServer });

    this.server.on('connection', (websocket : ws.WebSocket) => {
      console.log(`connection from ${websocket}`);

      websocket.on('close', (code, reason) => console.log('ws - close'));
      websocket.on('error', (err) => console.log('ws - error: %s', err));
      websocket.on('open', () => console.log('ws - open: %s'));

      websocket.on('message', (message) => {
        console.log('ws - message: %s', message);

        let data = JSON.parse(message);

        switch(data.action) {
          case 'search':
            this.goodreads
              .search(data.term)
              .toPromise()
              .then((result) => websocket.send(JSON.stringify({ result: result })))
              .catch((err) => websocket.send(JSON.stringify({ err: err })));

            break;

          case 'add':
            this.piratebayService
              .search(`${data.book.title} ${data.book.author}`)
              .then((results) => this.transmissionwrappper
                .add({
                    title: results[0].name,
                    url: results[0].magnetLink
                  } as Book))
              .then((result) => websocket.send(JSON.stringify({ result: result })))
              .catch((err) => websocket.send(JSON.stringify({ err: err })));
        }
      });
    });

    this.server.on('headers', (headers) => console.log('headers: %s', headers));
    this.server.on('listening', () => console.log('ws server listening'));
    this.server.on('error', (err) => console.log('error: %s', err));

  }
}
