import { TestBed } from '@angular/core/testing';

import { DelegationPageService } from './delegation-page.service';

describe('DelegationPageService', () => {
  let service: DelegationPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelegationPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
