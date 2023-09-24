import { TestBed } from '@angular/core/testing';

import { ExtractUserDetailService } from './identity-set.service';

describe('ExtractUserDetailService', () => {
  let service: ExtractUserDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtractUserDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
