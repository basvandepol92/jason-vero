import { Injectable } from '@angular/core';
import { OneSignal } from 'onesignal-ngx';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private oneSignal: OneSignal) { }

    async init() {
        try {
            await this.oneSignal.init({
                appId: "<YOUR_ONESIGNAL_APP_ID>", // Replace with your actual App ID
                allowLocalhostAsSecureOrigin: true,
            });
            console.log('OneSignal initialized');
        } catch (e) {
            console.warn('OneSignal failed to initialize', e);
        }
    }

    async requestPermission() {
        // Only needed for some platforms, usually init handles it or the prompt logic can be custom
        try {
            await (this.oneSignal as any)['showSlidedownPrompt']();
        } catch (e) {
            console.warn('Could not show permission prompt', e);
        }
    }
}
