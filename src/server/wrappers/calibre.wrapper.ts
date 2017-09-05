import * as child_process from 'child_process';

import { Observable, Observer } from 'rxjs/Rx';

import { Config } from '../shared/config';
import { Book } from '../shared/book';

export class CalibreWrapper {

  constructor(private config : Config){}

  public convert(book : Book) : Observable<Book> {
    const command = `ebook-convert`;
    let path = book.file;

    return Observable.create((observer: Observer<Book>) => {

      if(!path.endsWith('epub')) {
        observer.next(book);
        observer.complete();
      } else {
        child_process.spawn(command, [
          path,
          path.replace('.epub', '.mobi'),
          '--output-profile',
          this.config.get('calibre-profile')
        ], {
            stdio: "inherit",
            detached: false,
            shell: false
          }).on('exit', (code, signal) => {
              observer.next(book);
              observer.complete();
          }).on('error', (error) => {
              observer.error(error);
          });
      }
    });
  }

}
