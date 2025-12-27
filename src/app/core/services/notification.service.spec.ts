import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { OneSignal } from 'onesignal-ngx';

describe('NotificationService', () => {
    let service: NotificationService;
    let mockOneSignal: any; // Mocking complex OneSignal structure

    beforeEach(() => {
        mockOneSignal = {
            init: jasmine.createSpy('init').and.returnValue(Promise.resolve()),
            Notifications: {
                requestPermission: jasmine.createSpy('requestPermission').and.returnValue(Promise.resolve(true))
            },
            User: {
                PushSubscription: {
                    optedIn: false
                }
            }
        };

        TestBed.configureTestingModule({
            providers: [
                NotificationService,
                { provide: OneSignal, useValue: mockOneSignal }
            ]
        });
        service = TestBed.inject(NotificationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize OneSignal', fakeAsync(() => {
        service.init();
        tick();

        expect(mockOneSignal.init).toHaveBeenCalled();
    }));

    it('should request permission', fakeAsync(() => {
        service.requestPermission();
        tick();

        expect(mockOneSignal.Notifications.requestPermission).toHaveBeenCalled();
    }));

    it('should check subscription status', fakeAsync(() => {
        mockOneSignal.User.PushSubscription.optedIn = true;

        // Trigger check via init or requestPermission (since method is private)
        service.init();
        tick();

        expect(service.isSubscribed()).toBe(true);
    }));
});
