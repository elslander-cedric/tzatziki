import { Component, OnInit } from '@angular/core';
import { EbookFormatConverterService } from '../../services/ebook-format-converter.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private ebookFormatConverterService : EbookFormatConverterService) { }

  ngOnInit() {
    this.convert();
  }

  public convert() : void {
    this.ebookFormatConverterService.convert();
  }

}
