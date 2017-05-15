import { Pipe, PipeTransform } from '@angular/core';

import { Book } from '../shared/book';

@Pipe({
  name: 'bookFilter'
})
export class BookFilterPipe implements PipeTransform {

  transform(books: Book[], queryString : string): Book[] {
    return books.filter((book) => {
      return book.title.toLowerCase().match(queryString.toLowerCase()) ||
      book.author.toLowerCase().match(queryString.toLowerCase());
    });
  }

}
