import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineItemComponent } from './timeline-item.component';

describe('TimelineItemComponent', () => {
  let component: TimelineItemComponent;
  let fixture: ComponentFixture<TimelineItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineItemComponent);
    component = fixture.componentInstance;

    // Provide a mock item to avoid "cannot read properties of undefined" errors
    component.item = {
      id: 1,
      status: 'published',
      title: 'Test Event',
      start_time: '2025-12-23T20:00:00Z',
      end_time: '2025-12-23T21:00:00Z',
      location: 'Main Stage',
      icon_type: 'music'
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
