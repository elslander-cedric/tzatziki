import * as http from 'http';
import * as xml2json from 'xml2json';
import * as querystring from 'querystring';

import { Observable, Observer } from 'rxjs/Rx';

import { Config } from '../shared/config';
import { Book } from '../shared/book';

export class Goodreads {

  constructor(private config : Config) {}

  public search(term : string) : Observable<Array<Book>> {
    return this.query('/search/index.xml', {
      key: this.config.get("goodreadsAPIKey"),
      page: 1,
      search: "all", //title,author or all
      q: term
    });
  }

  private query(path : string, query : any) : Observable<Array<Book>> {
    let options = {
      hostname: 'www.goodreads.com',
      path: path + '?' + querystring.stringify(query),
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
      },
      json: true
    };

    return this.send(options)
      .reduce((acc: Buffer, value: Buffer) => Buffer.concat([acc, value]))
      .map((buffer : Buffer) => {
        let xml = buffer.toString();
        let json = JSON.parse(xml2json.toJson(xml));
        let books = json.GoodreadsResponse.search.results.work;

        return books.map((book) => {
          return {
            title: book.best_book.title,
            author: book.best_book.author.name
          } as Book
        });
      });
  }

  private send(options) : Observable<Buffer> {
    return Observable.create((observer : Observer<Buffer>) => {
      console.log(`[${options.method}] - ${options.path}`);

      http.request(options, (response) => {
        response
        .on('data', (chunk : Buffer) => observer.next(chunk))
        .on('end', () => observer.complete())
        .on('error', (e) => observer.error(e));
      }).end();
    });
  }
}
