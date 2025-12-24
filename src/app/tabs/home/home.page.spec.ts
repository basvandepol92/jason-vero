import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { HomePage } from './home.page';
import { AppConfigService } from '../../services/app-config.service';
import { DirectusService } from '../../services/directus.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        {
          provide: AppConfigService,
          useValue: { settings: signal({}) }
        },
        {
          provide: DirectusService,
          useValue: { getScheduleItems: () => Promise.resolve([]) }
        }
      ]
    });
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
