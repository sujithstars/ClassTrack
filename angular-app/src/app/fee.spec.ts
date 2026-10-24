import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { FeeService } from './fee.service';

describe('FeeService', () => {
  let service: FeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(FeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
