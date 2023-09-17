import { TestBed } from '@angular/core/testing';

import { DownloadAsPdfService } from './download-as-pdf.service';

describe('DownloadAsPdfService', () => {
  let service: DownloadAsPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadAsPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
