import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { OneSignal } from 'onesignal-ngx';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: OneSignal, useValue: {} }
      ]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
