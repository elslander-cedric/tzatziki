import * as fs from 'fs';

import { Promise } from 'bluebird';

export class Library {

  private static fileEncoding = 'utf-8';
  private static path = 'library.json';

  private _books : Array<string> = [];

  constructor() {};

  public init() : Library {
    let that = this;

    fs.exists(Library.path, function(exists) {
      fs.readFile(Library.path, {
        encoding: Library.fileEncoding,
        flag: exists ? 'r+' : 'w+'
      }, (err, data) => {
        if (err) throw err;
        that._books = JSON.parse(data || '[]');
      });
    });

    return this;
  }

  public write() : Promise<any|void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        Library.path,
        JSON.stringify(this._books),
        { encoding: Library.fileEncoding, flag: 'w' },
        (err) => {
          if (err) {
            reject(`write error: ${err}`)
          } else {
            resolve(`write ok`);
          }
        }
      );
    });
  }

  public add(book : string) : Promise<any|void> {
    if(this._books.indexOf(book) != -1) {
      return Promise.reject("book already in list");
    }

    this._books.push(book);
    return this.write();
  }

  get books() : Array<string> {
    return this._books;
  }
}
