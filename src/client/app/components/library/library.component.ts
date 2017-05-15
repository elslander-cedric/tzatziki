import { Component, OnInit } from '@angular/core';
import { Book } from '../../shared/book';

@Component({
  selector: 'library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  public books : Array<Book> = [
    {
      title: 'The Cathedral & the Bazaar: Musings on Linux and Open Source by an Accidental Revolutionary',
      author: "Eric S. Raymond",
      cover: "https://images.gr-assets.com/books/1387727575l/104744.jpg",
      status: "new",
      format: "mobi"
    }, {
      title: "The Twitter Book",
      author: "Tim O'Reilly",
      cover: "https://images.gr-assets.com/books/1328834986s/6356381.jpg",
      status: "new",
      format: "epub"
    }, {
      title: "Even Faster Web Sites",
      author: "Steve Souders",
      cover: "https://images.gr-assets.com/books/1328834858s/6438581.jpg",
      status: "new",
      format: "epub"
    }
  ] as Array<Book>;

  constructor() {

  }

  ngOnInit() {
  }


}
