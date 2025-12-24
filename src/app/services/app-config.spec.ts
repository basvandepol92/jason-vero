import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { APP_CONFIG } from '../core/config/app-config.token';

describe('AppConfigService', () => {
  let service: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiUrl: 'http://localhost:8055' } }
      ]
    });
    service = TestBed.inject(AppConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
