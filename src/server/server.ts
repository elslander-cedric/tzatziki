import { EbookFormatConverter } from './ebook-format-converter';

export class Server {

  public start() : void {
    let ebookFormatConverterService : EbookFormatConverter = new EbookFormatConverter();

    ebookFormatConverterService
      .convert('test.epub')
      .catch((err) => console.error(err));
  }
}

new Server().start();
