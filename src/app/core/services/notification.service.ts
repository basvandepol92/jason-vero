import { Injectable, inject, signal } from '@angular/core';
import { OneSignal } from 'onesignal-ngx';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private oneSignal = inject(OneSignal);

    public isSubscribed = signal(false);

    /**
     * Initializes OneSignal with the App ID.
     */
    async init() {
        console.log('🔔 Initializing OneSignal...');
        try {
            await this.oneSignal.init({
                appId: environment.oneSignalAppId,
                allowLocalhostAsSecureOrigin: true,
            });
            console.log('✅ OneSignal Initialized');
            this.checkSubscriptionStatus();
        } catch (err) {
            console.error('❌ OneSignal Init Error:', err);
        }
    }

    /**
     * Requests permission to show notifications.
     */
    async requestPermission() {
        console.log('🔔 Requesting Notification Permission...');
        try {
            // Ensure we are initialized before requesting
            const permission = await this.oneSignal.Notifications.requestPermission();
            console.log('📬 Permission Result:', permission);
            this.checkSubscriptionStatus();
        } catch (error) {
            console.error('❌ Error requesting notification permission:', error);
        }
    }

    /**
     * Checks if the user is currently subscribed.
     */
    private async checkSubscriptionStatus() {
        try {
            const isSubscribed = this.oneSignal.User.PushSubscription.optedIn;
            console.log('📊 Subscription Status:', isSubscribed);
            this.isSubscribed.set(isSubscribed || false);
        } catch (e) {
            console.warn('⚠️ Could not check OneSignal subscription status:', e);
        }
    }
}
