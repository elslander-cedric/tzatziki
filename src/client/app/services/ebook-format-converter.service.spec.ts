import { TestBed, inject } from '@angular/core/testing';

import { EbookFormatConverterService } from './ebook-format-converter.service';

describe('EbookFormatConverterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EbookFormatConverterService]
    });
  });

  it('should ...', inject([EbookFormatConverterService], (service: EbookFormatConverterService) => {
    expect(service).toBeTruthy();
  }));
});
