import { TestBed, inject } from '@angular/core/testing';

import { SoundsService } from './sounds.service';

describe('SoundsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SoundsService]
    });
  });

  it('should ...', inject([SoundsService], (service: SoundsService) => {
    expect(service).toBeTruthy();
  }));
});
