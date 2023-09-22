import { TestBed } from '@angular/core/testing';

import { DlpService } from './dlp.service';

describe('DlpService', () => {
  let service: DlpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DlpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
