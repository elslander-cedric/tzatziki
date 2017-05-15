import * as fs from 'fs';
import * as cloudconvert from 'cloudconvert';

import { Promise } from 'bluebird';

export class CloudConvertService {

  private cc = new cloudconvert('7-po7-b0GeNwIrXBliaPGrKaUhL6rQ1c07028fmf22EjiUMhyjQfobLYw4BZCCUlSP6auXIzILNAzO_SQOYmAg');

  public convert(path : string) : Promise<string|void> {
    console.log('convert %s', path);

    return new Promise((resolve, reject) => {
      fs.createReadStream(path)
          .pipe(this.cc.convert({
            inputformat: 'epub',
            outputformat: 'mobi'
          }))
          .pipe(fs.createWriteStream(path.replace('epub', 'mobi')))
          .on('error', function(err) {
              console.log("error", err);
              reject(err);
          })
          .on('finish', function() {
            console.log("conversion finished");
              resolve();
          });
    });
  }
}
