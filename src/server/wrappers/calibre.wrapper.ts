import * as child_process from 'child_process';

import { Observable, Observer } from 'rxjs/Rx';

export class CalibreWrapper {

  public convert(path : string) : Observable<string|void> {
    const command = `ebook-convert`;

    return Observable.create((observer: Observer<string>) => {

      if(!path.endsWith('epub')) {
        console.log('no conversion needed');
        observer.next(path);
        observer.complete();
      } else {
        console.log('convert %s', path);

        child_process.spawn(command, [path, path.replace('.epub', '.mobi')], {
            stdio: "inherit",
            detached: false,
            shell: false
          }).on('exit', (code, signal) => {
              console.log(`ebook-convert exit for ${path}`);
              observer.next(path);
              observer.complete();
          }).on('error', (error) => {
              console.error(`ebook-convert error ${error}`);
              observer.error(error);
          });
      }
    });
  }

}
