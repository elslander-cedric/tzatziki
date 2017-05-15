import { Config } from './shared/config';
import { CalibreWrapper } from './wrappers/calibre.wrapper';
import { TorrentService } from './services/torrent.service';
import { EmailService } from './services/email.service';
import { LocalEBookObserver } from './local-ebook-observer';

export class Server {

  public start() : void {
    const config = new Config();

    const observer : LocalEBookObserver = new LocalEBookObserver(config);
    const calibre : CalibreWrapper = new CalibreWrapper();
    const email : EmailService = new EmailService(config);

    observer
      .onEbookAdded()
      .concatMap((ebook : string) => calibre.convert(ebook))
      .concatMap((ebook : string) => email.send(ebook.replace('epub', 'mobi')))
      .toPromise()
      .then()
      .catch((err) => console.error(err));;

    new TorrentService(config).start();
  }
}

new Server().start();
