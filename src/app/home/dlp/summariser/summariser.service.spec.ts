import { TestBed } from '@angular/core/testing';

import { SummariserService } from './summariser.service';

describe('SummariserService', () => {
  let service: SummariserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummariserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
