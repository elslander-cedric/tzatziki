import * as ThePirateBay from 'thepiratebay';

import { Promise } from 'bluebird';

export class PirateBayService {

  public search(term: string): Promise<any> {
    console.log('search piratebay for:', term);

    return ThePirateBay.search(term, {
      category: 'other',
      subcategory: { name: "E-books"},
      filter: {
          verified: false
      },
      page: 0,
      orderBy: 'leeches',
      sortBy: 'desc'
    })
    .then(results => {
      return new Promise.resolve(results);
    })
    .catch(err => console.log(err));
  }
}
