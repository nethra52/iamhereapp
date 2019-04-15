import { TestBed } from '@angular/core/testing';

import { FiremessageService } from './firemessage.service';

describe('FiremessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FiremessageService = TestBed.get(FiremessageService);
    expect(service).toBeTruthy();
  });
});
