import { TestBed } from '@angular/core/testing';

import { MiddleMongoService } from './middle-mongo.service';

describe('MiddleMongoService', () => {
  let service: MiddleMongoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiddleMongoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
