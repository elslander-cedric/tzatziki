import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

import { WebSocketService } from '../../services/websocket.service';
import { Book } from '../../shared/book';

@Component({
  selector: 'book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit {

  private searchTermStream = new Subject<string>();

  constructor(
    private websocketService : WebSocketService){};

  ngOnInit() {}

  public search(term : string) : void {
    this.searchTermStream.next(term);
  }

  public books : Observable<Array<Book>> =  this.searchTermStream
    .debounceTime(800)
    .distinctUntilChanged()
    .switchMap(term =>
      this.websocketService.send({
        action: 'search',
        term: term
      }).catch(() => {
        return Observable.of([]);
      })
    );

  public add(book : Book) : Promise<any> {
    console.log("add book:", book);

    return this.websocketService
      .send({ action: 'add', book: book})
      .toPromise()
      .then(() => console.log("successfully added book: %s", book))
      .catch((err : never) => console.error(`error occured while adding book: ${err}`));
  }
}
