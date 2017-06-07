import * as http from 'http';
import * as querystring from 'querystring';
import * as xml2js from 'xml2js';

import { Observable, Observer } from 'rxjs/Rx';

import { Config } from '../shared/config';
import { Book } from '../shared/book';

export class Goodreads {

  constructor(private config: Config) {}

  public newBooks(date : number) : Observable<Array<Book>> {
    return this.toRead()
      .map((books : Array<Book>) => {
        return books.filter((book : Book) => {
          return Date.parse(book.date_added) > date; // Tue May 02 10:36:46 -0700 2017
        });
      });
  }

  public toRead() : Observable<Array<Book>> {
    return this.query('/review/list', {
      key: this.config.get("goodreadsAPIKey"),
      v: 2,
      shelf: 'to-read',
      id: this.config.get("goodreadsUID")
      // sort: title, author, cover, rating, year_pub, date_pub, date_pub_edition, date_started, date_read, date_updated, date_added, recommender, avg_rating, num_ratings, review, read_count, votes, random, comments, notes, isbn, isbn13, asin, num_pages, format, position, shelves, owned, date_purchased, purchase_location, condition (optional)
      // search[query]: query text to match against member's books (optional)
      // order: a, d (optional)
      // page: 1-N (optional)
      // per_page: 1-200 (optional)
    })
    .switchMap((buffer: Buffer) => {
      return Observable.create((observer : Observer<any>) => {
        let xml = buffer.toString();
        xml2js.parseString(xml, function(err, json) {
          if (err) {
            observer.error(err);
          } else {
            let books : Array<Book> = json.GoodreadsResponse.reviews[0].review.map((item) => {
              return {
                title: item.book[0].title[0],
                author: item.book[0].authors[0].author[0].name[0],
                date_added: item.date_added[0]
              } as Book
            });

            observer.next(books);
            observer.complete();
          }
        });
      });
    });
  }

  public search(term: string): Observable<Array<Book>> {
    return this.query('/search/index.xml', {
      key: this.config.get("goodreadsAPIKey"),
      page: 1,
      search: "all", //title,author or all
      q: term
    })
    .switchMap((buffer: Buffer) => {
      return Observable.create((observer : Observer<any>) => {
        let xml = buffer.toString();
        xml2js.parseString(xml, function(err, json) {
          if (err) {
            observer.error(err);
          } else {
            let books : Array<Book> = json.GoodreadsResponse.search[0].results[0].work.map((item) => {
              return {
                title: item.best_book[0].title[0],
                author: item.best_book[0].author[0].name[0],
                rating: item.average_rating[0],
                cover: item.best_book[0].image_url[0]
              } as Book
            });

            observer.next(books.slice(0, 9));
            observer.complete();
          }
        });
      });
    });
  }

  private query(path: string, query: any): Observable<Buffer> {
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
      .reduce((acc: Buffer, value: Buffer) => Buffer.concat([acc, value]));
  }

  private send(options): Observable<Buffer> {
    return Observable.create((observer: Observer<Buffer>) => {
      http.request(options, (response) => {
        response
          .on('data', (chunk: Buffer) => observer.next(chunk))
          .on('end', () => observer.complete())
          .on('error', (e) => observer.error(e));
      }).end();
    });
  }
}
