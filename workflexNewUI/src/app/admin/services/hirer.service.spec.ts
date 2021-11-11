import { TestBed } from '@angular/core/testing';

import { HirerService } from './hirer.service';

describe('HirerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HirerService = TestBed.get(HirerService);
    expect(service).toBeTruthy();
  });
});
