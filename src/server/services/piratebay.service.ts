import * as ThePirateBay from 'thepiratebay';

import { Promise } from 'bluebird';

export class PirateBayService {

  public search(term: string): Promise<any> {
    let searchTerm = term.replace(/\(.*\)/,'');

    return ThePirateBay.search(searchTerm, {
      category: 'other',
      subcategory: { name: "E-books"},
      filter: { verified: false },
      page: 0,
      orderBy: 'leeches',
      sortBy: 'desc'
    });
  }
}
