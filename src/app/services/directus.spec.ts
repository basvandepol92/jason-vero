import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { DirectusService } from './directus.service';
import { APP_CONFIG } from '../core/config/app-config.token';

describe('DirectusService', () => {
  let service: DirectusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiUrl: 'http://localhost:8055' } }
      ]
    });
    service = TestBed.inject(DirectusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
