import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AppConfigService } from '../services/app-config.service';
import { ToastController } from '@ionic/angular/standalone';

export const featureFlagGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const appConfig = inject(AppConfigService);
  const toastCtrl = inject(ToastController);

  const flagName = route.data['flag'] as string;
  const settings: any = appConfig.settings(); // Using any to index by string key safely-ish

  if (settings && settings[flagName] === true) {
    return true;
  }

  // Flag is false, show toast and redirect
  const toast = await toastCtrl.create({
    message: 'Nog even geduld!',
    duration: 2000,
    color: 'warning',
    position: 'top'
  });
  await toast.present();

  return router.createUrlTree(['/tabs/home']);
};
