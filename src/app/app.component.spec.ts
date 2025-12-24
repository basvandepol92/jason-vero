import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { NotificationService } from './core/services/notification.service';
import { APP_CONFIG } from './core/config/app-config.token';

describe('AppComponent', () => {
  let mockNotificationService: any;

  beforeEach(async () => {
    mockNotificationService = {
      init: jasmine.createSpy('init')
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: APP_CONFIG, useValue: { apiUrl: 'http://localhost:8055' } }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize notification service', () => {
    TestBed.createComponent(AppComponent);
    expect(mockNotificationService.init).toHaveBeenCalled();
  });
});
