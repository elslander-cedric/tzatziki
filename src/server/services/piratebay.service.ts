import * as ThePirateBay from 'thepiratebay';

import { Promise } from 'bluebird';

export class PirateBayService {

  public search(term: string): Promise<any> {
    return ThePirateBay.search(term, {
      category: 'all',    // default - 'all' | 'all', 'audio', 'video', 'xxx',
      //                   'applications', 'games', 'other'
      //
      // You can also use the category number:
      // `/search/0/99/{category_number}`
      filter: {
          verified: false    // default - false | Filter all VIP or trusted torrents
      },
      page: 0,            // default - 0 - 99
      orderBy: 'leeches', // default - name, date, size, seeds, leeches
      sortBy: 'desc'      // default - desc, asc
    })
    .then(results => {
      /*
      {
        name: 'Game of Thrones (2014)(dvd5) Season 4 DVD 1 SAM TBS',
        size: '4.17 GiB',
        link: 'http://thepiratebay.se/torrent/10013794/Game_of_Thron...'
        category: { id: '200', name: 'Video' },
        seeders: '125',
        leechers: '552',
        uploadDate: 'Today 00:57',
        magnetLink: 'magnet:?xt=urn:btih:4e6a2304fed5841c04b16d61a0ba...
        subcategory: { id: '202', name: 'Movies DVDR' }
      }
      */
      //console.log(results);

      return new Promise.resolve(results);
    })
    .catch(err => console.log(err));
  }
}
