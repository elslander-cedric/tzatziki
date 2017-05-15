import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EbookFormatConverterService } from './services/ebook-format-converter.service';
import { LibraryComponent } from './components/library/library.component';
import { BookFilterPipe } from './pipes/book-filter.pipe';
import { BookSearchComponent } from './components/book-search/book-search.component';
import { TorrentService } from './services/torrent.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LibraryComponent,
    BookFilterPipe,
    BookSearchComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [ EbookFormatConverterService, TorrentService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
