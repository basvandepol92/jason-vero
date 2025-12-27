import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { HomePage } from './home.page';
import { AppConfigService } from '../../services/app-config.service';
import { DirectusService } from '../../services/directus.service';
import { ScheduleItem } from '../../models/app.models';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let mockDirectusService: jasmine.SpyObj<DirectusService>;
  let mockAppConfigService: any;

  const mockScheduleItems: ScheduleItem[] = [
    {
      id: 1,
      status: 'published',
      title: 'Opening Ceremony',
      start_time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      location: 'Main Stage',
      day: 'Friday',
      icon_type: 'music'
    },
    {
      id: 2,
      status: 'published',
      title: 'Upcoming Event',
      start_time: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
      end_time: new Date(Date.now() + 10800000).toISOString(), // 3 hours from now
      location: 'Side Stage',
      day: 'Friday',
      icon_type: 'food'
    }
  ];

  beforeEach(() => {
    mockDirectusService = jasmine.createSpyObj('DirectusService', ['getScheduleItems']);
    mockDirectusService.getScheduleItems.and.returnValue(Promise.resolve(mockScheduleItems));

    mockAppConfigService = {
      settings: signal({
        show_schedule: true,
        show_map: true,
        show_feed: true,
        show_info: true,
        event_name: 'Test Festival',
        event_date: new Date(Date.now() + 86400000).toISOString() // 1 day from now
      })
    };

    TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        { provide: AppConfigService, useValue: mockAppConfigService },
        { provide: DirectusService, useValue: mockDirectusService }
      ]
    });

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load happening now event on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockDirectusService.getScheduleItems).toHaveBeenCalled();
    expect(component.happeningNow()).toBeTruthy();
    expect(component.happeningNow()?.title).toBe('Opening Ceremony');
    expect(component.isLive()).toBe(true);
  }));

  it('should show upcoming event when no live event', fakeAsync(() => {
    const futureItems: ScheduleItem[] = [
      {
        id: 1,
        status: 'published',
        title: 'Future Event',
        start_time: new Date(Date.now() + 7200000).toISOString(),
        end_time: new Date(Date.now() + 10800000).toISOString(),
        location: 'Main Stage',
        day: 'Saturday',
        icon_type: 'music'
      }
    ];

    mockDirectusService.getScheduleItems.and.returnValue(Promise.resolve(futureItems));
    fixture.detectChanges();
    tick();

    expect(component.happeningNow()).toBeTruthy();
    expect(component.happeningNow()?.title).toBe('Future Event');
    expect(component.isLive()).toBe(false);
  }));

  it('should start countdown when event_date is provided', fakeAsync(() => {
    fixture.detectChanges();
    tick(1000);

    expect(component.days()).toBeGreaterThanOrEqual(0);
    expect(component.hours()).toBeGreaterThanOrEqual(0);
    expect(component.minutes()).toBeGreaterThanOrEqual(0);
    expect(component.seconds()).toBeGreaterThanOrEqual(0);
  }));

  it('should mark festival as started when event_date is in the past', fakeAsync(() => {
    mockAppConfigService.settings.set({
      ...mockAppConfigService.settings(),
      event_date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    });

    fixture.detectChanges();
    tick(1000);

    expect(component.isFestivalStarted()).toBe(true);
  }));

  it('should handle empty schedule gracefully', fakeAsync(() => {
    mockDirectusService.getScheduleItems.and.returnValue(Promise.resolve([]));
    fixture.detectChanges();
    tick();

    expect(component.happeningNow()).toBeNull();
    expect(component.isLoadingHappeningNow()).toBe(false);
  }));

  it('should cleanup interval on destroy', () => {
    fixture.detectChanges();
    spyOn(window, 'clearInterval');

    component.ngOnDestroy();

    expect(window.clearInterval).toHaveBeenCalled();
  });
});
