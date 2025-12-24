import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { InfoPage } from './info.page';
import { DirectusService } from '../../services/directus.service';
import { NotificationService } from '../../services/notification.service';

describe('InfoPage', () => {
  let component: InfoPage;
  let fixture: ComponentFixture<InfoPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InfoPage],
      providers: [
        provideRouter([]),
        {
          provide: DirectusService,
          useValue: { getInfoItems: () => Promise.resolve([]) }
        },
        {
          provide: NotificationService,
          useValue: { init: () => { } }
        }
      ]
    });
    fixture = TestBed.createComponent(InfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
