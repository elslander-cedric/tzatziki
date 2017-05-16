import * as Transmission from 'transmission';
import * as fs from 'fs';

import { Promise } from 'bluebird';

import { Book } from '../shared/book';
import { Config } from '../shared/config';

export class TransmissionWrapper {

  private transmission : Transmission;
  private books = new Array<Book>();

  constructor(private config : Config) {
    this.transmission = new Transmission({
    	port: this.config.get('transmissionPort'),
    	host: this.config.get('transmissionHost'),
    	username: this.config.get('transmissionUser'),
    	password: this.config.get('transmissionPassword')
    });
  }

  public onEbookDownloaded(book : Book) {
    console.log('wait for book: ', book);
    this.transmission.waitForState(book.id, 5 /*SEED_WAIT*/, (err, arg) => {
      console.log('wait end: ', arg);
      if(err) {
        console.error(err);
      } else {
        //fs.createReadStream(`${this.config.get('downloadsdir')}/${book.title}`).pipe(
        //  fs.createWriteStream(`${this.config.get('booksdir')}/${book.title}`));
      }
    });
  }

  public add(book : Book) : Promise<any> {
    console.log("add book", book.title);
    let that = this;
    return new Promise((resolve, reject) => {
      this.transmission.addUrl(book.url, function(err, result) {
          if (err) {
            reject(err);
          } else {
            console.log('book: ', result);
            that.books.push({
              id: result.id,
              title: result.name
            } as Book);
            that.onEbookDownloaded(result);
            resolve(result);
          }
      });
    });
  }
}
