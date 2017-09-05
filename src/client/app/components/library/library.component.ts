import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { WebSocketService } from '../../services/websocket.service';
import { Book } from '../../shared/book';

@Component({
  selector: 'library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

  public books : Array<Book> = [
    {
      title: "Assassin's Apprentice (Farseer Trilogy, #1)",
      author: "Robin Hobb",
      cover: "http://images.gr-assets.com/books/1464570795m/77197.jpg"
    },
    {
      title: "Royal Assassin (Farseer Trilogy, #2)",
      author: "Robin Hobb",
      cover: "http://images.gr-assets.com/books/1428234219m/25300956.jpg"
    },
    {
      title: "Assassin's Quest (Farseer Trilogy, #3)",
      author: "Robin Hobb",
      cover: "http://images.gr-assets.com/books/1481883253m/33396914.jpg"
    },
    {
      title: "Fool's Errand (Tawny Man, #1)",
      author: "Robin Hobb",
      cover: "http://images.gr-assets.com/books/1360508839m/68488.jpg"
    },
    {
      title: "Ship of Magic (Liveship Traders, #1)",
      author: "Robin Hobb",
      cover: "http://images.gr-assets.com/books/1360507722m/45100.jpg"
    },
    {
      title: "Golden Fool (Tawny Man, #2)",
      author: "Robin Hobb",
      cover: "http://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png"
    },
    {
      title: "Fool's Fate (Tawny Man, #3)",
      author: "Robin Hobb",
      cover: "http://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png"
    },
    {
      title: "Fool's Assassin (The Fitz and the Fool, #1)",
      author: "Robin Hobb",
      cover: "http://images.gr-assets.com/books/1393886110m/19288321.jpg"
    },
    {
      title: "Ship of Destiny (Liveship Traders, #3)",
      author: "Robin Hobb",
      cover: "http://images.gr-assets.com/books/1403180325m/45102.jpg"
    }
  ] as Array<Book>;

  constructor(private websocketService : WebSocketService) {

  }

  ngOnInit() {
  }

  public download(book : Book) : void {

  }
}
