import { TestBed } from '@angular/core/testing';

import { GetAuthorisatonService } from './get-authorisaton.service';

describe('GetAuthorisatonService', () => {
  let service: GetAuthorisatonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAuthorisatonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
