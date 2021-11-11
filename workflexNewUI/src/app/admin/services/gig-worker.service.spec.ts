import { TestBed } from '@angular/core/testing';

import { GigWorkerService } from './gig-worker.service';

describe('GigWorkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GigWorkerService = TestBed.get(GigWorkerService);
    expect(service).toBeTruthy();
  });
});
