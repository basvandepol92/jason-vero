import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DirectusService } from './directus.service';
import { ApiService } from '../core/services/api.service';
import { of, throwError } from 'rxjs';
import { AppSettings, NewsItem, ScheduleItem, LocationItem, InfoItem } from '../models/app.models';

describe('DirectusService', () => {
  let service: DirectusService;
  let mockApiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    mockApiService = jasmine.createSpyObj('ApiService', ['getItems', 'getSingleton']);

    TestBed.configureTestingModule({
      providers: [
        DirectusService,
        { provide: ApiService, useValue: mockApiService }
      ]
    });
    service = TestBed.inject(DirectusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get app settings', fakeAsync(() => {
    const mockSettings: AppSettings = {
      show_schedule: true,
      show_map: true,
      show_feed: true,
      show_info: true,
      event_name: 'Test Fest'
    };
    mockApiService.getSingleton.and.returnValue(of(mockSettings));

    let result: AppSettings | undefined;
    service.getAppSettings().then(res => result = res);
    tick();

    expect(mockApiService.getSingleton).toHaveBeenCalledWith('globals');
    expect(result).toEqual(mockSettings);
  }));

  it('should return default settings on error', fakeAsync(() => {
    mockApiService.getSingleton.and.returnValue(throwError(() => new Error('API Error')));

    let result: AppSettings | undefined;
    service.getAppSettings().then(res => result = res);
    tick();

    expect(result).toBeDefined();
    expect(result?.event_name).toBe('Jason & Vero 12.5 Fest'); // Default
  }));

  it('should get news items', fakeAsync(() => {
    mockApiService.getItems.and.returnValue(of([]));

    service.getNewsItems();
    tick();

    expect(mockApiService.getItems).toHaveBeenCalledWith('news', jasmine.any(Object));
  }));

  it('should get schedule items', fakeAsync(() => {
    mockApiService.getItems.and.returnValue(of([]));

    service.getScheduleItems();
    tick();

    expect(mockApiService.getItems).toHaveBeenCalledWith('schedule', jasmine.any(Object));
  }));
});
