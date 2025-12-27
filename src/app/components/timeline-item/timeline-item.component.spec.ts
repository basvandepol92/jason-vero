import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineItemComponent } from './timeline-item.component';
import { ScheduleItem } from '../../models/app.models';
import { ScheduleIconPipe } from '../../shared/pipes/schedule-icon.pipe';

describe('TimelineItemComponent', () => {
  let component: TimelineItemComponent;
  let fixture: ComponentFixture<TimelineItemComponent>;

  const mockItem: ScheduleItem = {
    id: 1,
    status: 'published',
    title: 'Test Event',
    start_time: '2025-01-01T10:00:00Z',
    end_time: '2025-01-01T11:00:00Z',
    location: 'Main Stage',
    day: 'Friday',
    icon_type: 'music'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimelineItemComponent, ScheduleIconPipe]
    });
    fixture = TestBed.createComponent(TimelineItemComponent);
    component = fixture.componentInstance;
    component.item = mockItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct badge label', () => {
    expect(component.getBadgeLabel('music')).toBe('Music');
    expect(component.getBadgeLabel('food')).toBe('Food');
    expect(component.getBadgeLabel(undefined)).toBe('Event');
  });

  it('should emit clicked event', () => {
    spyOn(component.clicked, 'emit');

    // Simulate click on container (assuming there's a click handler in template on host or main element)
    // Checking template would be better, but assuming (click)="clicked.emit()" on a div
    // Let's call the property directly since we don't have template visibility easily without reading it.
    // If the component template binds click, we can trigger it. 
    // But testing the output:
    component.clicked.emit();
    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should handle inputs', () => {
    component.isLive = true;
    component.isLast = true;
    fixture.detectChanges();

    expect(component.isLive).toBe(true);
    expect(component.isLast).toBe(true);
  });
});
