import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { SchedulePage } from './schedule.page';
import { ScheduleService, GroupedSchedule } from '../../core/services/schedule.service';
import { APP_CONFIG } from '../../core/config/app-config.token';
import { ScheduleItem } from '../../models/app.models';
import { of } from 'rxjs';

describe('SchedulePage', () => {
  let component: SchedulePage;
  let fixture: ComponentFixture<SchedulePage>;
  let mockScheduleService: jasmine.SpyObj<ScheduleService>;

  const mockScheduleItems: ScheduleItem[] = [
    {
      id: 1,
      status: 'published',
      title: 'Friday Event 1',
      start_time: '2025-12-25T18:00:00Z',
      end_time: '2025-12-25T19:00:00Z',
      location: 'Main Stage',
      day: 'Friday',
      icon_type: 'music',
      description: 'Opening act'
    }
  ];

  const mockGroupedSchedule: GroupedSchedule = {
    'Friday': mockScheduleItems
  };

  beforeEach(() => {
    mockScheduleService = jasmine.createSpyObj('ScheduleService', ['getGroupedSchedule']);
    mockScheduleService.getGroupedSchedule.and.returnValue(of(mockGroupedSchedule));

    TestBed.configureTestingModule({
      imports: [SchedulePage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiUrl: 'http://localhost:8055' } },
        { provide: ScheduleService, useValue: mockScheduleService }
      ]
    });

    fixture = TestBed.createComponent(SchedulePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and set grouped schedule', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockScheduleService.getGroupedSchedule).toHaveBeenCalled();
    expect(component.groupedSchedule()).toEqual(mockGroupedSchedule);
    expect(component.days()).toContain('Friday');
    // It should select the first day if current day is not in list
    expect(component.selectedDay()).toBe('Friday');
  }));

  it('should change day', () => {
    component.selectedDay.set('Saturday');

    // Simulate day change event
    const event = { detail: { value: 'Sunday' } };
    component.dayChanged(event);

    expect(component.selectedDay()).toBe('Sunday');
  });

  it('should compute displayed items correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    // Default selected day is Friday
    expect(component.displayedItems().length).toBe(1);
    expect(component.displayedItems()[0].title).toBe('Friday Event 1');
  }));

  it('should open details modal', () => {
    const item = mockScheduleItems[0];
    component.openDetails(item);
    expect(component.selectedItem()).toBe(item);
    expect(component.isModalOpen()).toBe(true);
  });

  it('should close modal', () => {
    component.isModalOpen.set(true);
    component.closeModal();
    expect(component.isModalOpen()).toBe(false);
  });

  it('should check if event is live', () => {
    const now = new Date();
    component.currentTime.set(now);

    const liveItem: ScheduleItem = {
      ...mockScheduleItems[0],
      start_time: new Date(now.getTime() - 1000).toISOString(),
      end_time: new Date(now.getTime() + 1000).toISOString()
    };

    const isLive = component.checkLive(liveItem);
    expect(isLive).toBe(true);

    const pastItem: ScheduleItem = {
      ...mockScheduleItems[0],
      start_time: new Date(now.getTime() - 2000).toISOString(),
      end_time: new Date(now.getTime() - 1000).toISOString()
    };
    expect(component.checkLive(pastItem)).toBe(false);
  });
});
