import { TestBed } from '@angular/core/testing';

import { IsAssignedGuard } from './is-assigned.guard';

describe('IsAssignedGuard', () => {
  let guard: IsAssignedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsAssignedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
