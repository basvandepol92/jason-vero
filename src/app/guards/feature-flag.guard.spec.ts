import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { featureFlagGuard } from './feature-flag.guard';
import { AppConfigService } from '../services/app-config.service';
import { ToastController } from '@ionic/angular/standalone';
import { signal } from '@angular/core';

describe('featureFlagGuard', () => {
  let mockAppConfigService: any;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastCtrl: any;

  beforeEach(() => {
    mockAppConfigService = {
      settings: signal({
        show_schedule: true,
        show_map: false
      })
    };

    mockRouter = jasmine.createSpyObj('Router', ['createUrlTree']);

    // Mock ToastController and its created toast object
    mockToastCtrl = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
        present: jasmine.createSpy('present').and.returnValue(Promise.resolve())
      }))
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AppConfigService, useValue: mockAppConfigService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastController, useValue: mockToastCtrl }
      ]
    });
  });

  it('should allow navigation when flag is true', async () => {
    const route: any = { data: { flag: 'show_schedule' } }; // Corrected key 'flag'
    const state: any = {};

    const result = await TestBed.runInInjectionContext(() => featureFlagGuard(route, state)) as boolean;
    expect(result).toBe(true);
  });

  it('should redirect to home when flag is false', async () => {
    const route: any = { data: { flag: 'show_map' } };
    const state: any = {};

    await TestBed.runInInjectionContext(() => featureFlagGuard(route, state));

    expect(mockToastCtrl.create).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/tabs/home']);
  });

  it('should allow navigation if flag is missing in settings (guard returns falsy -> redirect)', async () => {
    const route: any = { data: { flag: 'show_something_else' } };
    const state: any = {};

    await TestBed.runInInjectionContext(() => featureFlagGuard(route, state));

    // Logic: if settings[flagName] === true returns true. Else toast+redirect.
    // 'show_something_else' is undefined in settings, so it falls to else.
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/tabs/home']);
  });
});
