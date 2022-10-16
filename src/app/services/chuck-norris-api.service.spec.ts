import { TestBed } from '@angular/core/testing';

import { ChuckNorrisApiService } from './chuck-norris-api.service';

describe('ChuckNorrisApiService', () => {
  let service: ChuckNorrisApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChuckNorrisApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
