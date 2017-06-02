import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';
import * as Transmission from 'transmission';

import { Observable, Observer } from 'rxjs/Rx';

import { Book } from './shared/book';
import { Config } from './shared/config';
import { Library } from './library';


export class LocalEBookObserver {

  private library: Library;

  constructor(private config :Config) {
    this.library = new Library().init();
  }

  public onEbookAdded(): Observable<string> {
    let watchdir = this.config.get('downloadsdir');

    return Observable.create((observer: Observer<string>) => {
      let watcher = chokidar.watch(watchdir, { ignored: /^\./, persistent: true })
      .on('add', (filename) => {
        if (!filename.endsWith('.epub') && !filename.endsWith('.mobi')) {
          console.error("not an ebook");
        } else {
          this.library.add(filename.replace('.epub', '').replace('.mobi', ''))
          .then(() => {
            observer.next(filename);
          })
          .catch((err) => {
            console.error(err);
          });
        }
      });
    });
  }
}
