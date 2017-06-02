import { Component, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
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
    private websocketService : WebSocketService,
    public snackBar: MdSnackBar){};

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

  public download(book : Book) : Promise<any> {
    book.downloading = true;
    return this.websocketService
      .send({ action: 'download', book: book})
      .toPromise()
      .then(() => {
        book.downloading = false;
        this.snackBar.open(`downloading ${book.title}`, '', {
          duration: 3000
        });
      })
      .catch((err : never) => {
        book.downloading = false;
        this.snackBar.open(err, '', { duration: 3000 });
      });
  }
}
