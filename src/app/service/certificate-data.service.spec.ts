import { TestBed } from '@angular/core/testing';

import { CertificateDataService } from './certificate-data.service';

describe('CertificateDataService', () => {
  let service: CertificateDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificateDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
