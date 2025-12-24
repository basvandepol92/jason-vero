import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SchedulePage } from './schedule.page';
import { DirectusService } from '../../services/directus.service';

describe('SchedulePage', () => {
  let component: SchedulePage;
  let fixture: ComponentFixture<SchedulePage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SchedulePage],
      providers: [
        provideRouter([]),
        {
          provide: DirectusService,
          useValue: { getScheduleItems: () => Promise.resolve([]) }
        }
      ]
    });
    fixture = TestBed.createComponent(SchedulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
