import * as http from "http";

import { IncomingMessage, ServerResponse } from "http";

import { Book } from './shared/book';
import { Config } from './shared/config';
import { CalibreWrapper } from './wrappers/calibre.wrapper';
import { TransmissionWrapper } from './wrappers/transmission.wrapper';
import { WebSocketService } from './services/websocket.service';
import { EmailService } from './services/email.service';
import { Goodreads } from './services/goodreads.service';
import { PirateBayService } from './services/piratebay.service';
import { LocalEBookObserver } from './local-ebook-observer';
import { HttpGetRequestHandler } from './handlers/http-get-request-handler';

export class Server {

  private server : http.Server;

  constructor() {};

  public start() : void {
    console.log("starting http server ...");

    let config : Config = new Config().init();

    const observer : LocalEBookObserver = new LocalEBookObserver(config);
    const calibre : CalibreWrapper = new CalibreWrapper(config);
    const email : EmailService = new EmailService(config);
    const pirateBayService : PirateBayService = new PirateBayService();
    const transmissionWrapper : TransmissionWrapper = new TransmissionWrapper(config);
    const goodreads : Goodreads = new Goodreads(config, pirateBayService, transmissionWrapper).init();
    const httpGetRequestHandler : HttpGetRequestHandler = new HttpGetRequestHandler();

    transmissionWrapper.subscribeForEvents((book : Book) => {
      if(book.state === 'download_succeeded') {
        calibre.convert(book)
          .toPromise()
          .then((book : Book) => email.send(book))
          .catch((err) => console.error(err));
      }
    });

    goodreads.watchNewToRead()
      .subscribe((books : Array<Book>) => {
        books.forEach((book : Book) => {
          pirateBayService
            .search(`${book.title} ${book.author}`)
            .then((results) => {
              if(results.length === 0) {
                return Promise.reject('No torrents found');
              } else {
                return transmissionWrapper
                  .add({
                    title: results[0].name,
                    url: results[0].magnetLink
                  } as Book);
              }
            })
            .then(() => console.log("book added"))
            .catch(err => console.error(err));
        });
      });

    // goodreads.oAuthAuthorize()
    //   .then((authUrl) => { /* TODO-FIXME */})
    //   .catch(err => console.error(err));

    /*
    observer
      .onEbookAdded()
      .concatMap((ebook : string) => calibre.convert(ebook))
      .concatMap((ebook : string) => email.send(ebook.replace('epub', 'mobi')))
      .toPromise()
      .then()
      .catch((err) => console.error(err));
    */

    this.server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
      httpGetRequestHandler.handle(request, response);
    });

    new WebSocketService(
      this.server,
      config,
      goodreads,
      pirateBayService,
      transmissionWrapper
    ).start();

    this.server.listen(config.get("port"));
    console.log("http server listening");
  }

  public stop() :void {
    console.log("stopping server ...");
    this.server.close();
  }
}

new Server().start();
