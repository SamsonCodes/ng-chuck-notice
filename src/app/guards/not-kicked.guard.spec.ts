import { TestBed } from '@angular/core/testing';

import { NotKickedGuard } from './not-kicked.guard';

describe('NotKickedGuard', () => {
  let guard: NotKickedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NotKickedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
