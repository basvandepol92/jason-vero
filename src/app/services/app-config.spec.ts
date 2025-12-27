import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { DirectusService } from './directus.service';
import { APP_CONFIG } from '../core/config/app-config.token';
import { AppSettings } from '../models/app.models';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let mockDirectusService: jasmine.SpyObj<DirectusService>;

  beforeEach(() => {
    mockDirectusService = jasmine.createSpyObj('DirectusService', ['getAppSettings']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiUrl: 'http://localhost:8055' } },
        { provide: DirectusService, useValue: mockDirectusService }
      ]
    });
    service = TestBed.inject(AppConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load settings', fakeAsync(() => {
    const mockSettings: AppSettings = {
      show_schedule: true,
      show_map: true,
      show_feed: true,
      show_info: true,
      event_name: 'Configured Fest'
    };
    mockDirectusService.getAppSettings.and.returnValue(Promise.resolve(mockSettings));

    service.loadAppConfig();
    tick();

    expect(service.settings()).toEqual(mockSettings);
  }));

  it('should keep defaults on error', fakeAsync(() => {
    mockDirectusService.getAppSettings.and.returnValue(Promise.reject('Error'));

    service.loadAppConfig();
    tick();

    expect(service.settings().show_schedule).toBe(true); // Default
    expect(service.settings().event_name).toBeUndefined(); // Default doesn't have it set initially in signal definition?
    // Let's check signal init value in service.
  }));
});
