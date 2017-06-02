import * as child_process from 'child_process';

import { Observable, Observer } from 'rxjs/Rx';

export class CalibreWrapper {

  public convert(path : string) : Observable<string|void> {
    const command = `ebook-convert`;

    return Observable.create((observer: Observer<string>) => {

      if(!path.endsWith('epub')) {
        observer.next(path);
        observer.complete();
      } else {
        child_process.spawn(command, [path, path.replace('.epub', '.mobi')], {
            stdio: "inherit",
            detached: false,
            shell: false
          }).on('exit', (code, signal) => {
              observer.next(path);
              observer.complete();
          }).on('error', (error) => {
              observer.error(error);
          });
      }
    });
  }

}
