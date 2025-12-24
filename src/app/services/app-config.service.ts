import { Injectable, signal, computed } from '@angular/core';
import { DirectusService } from './directus.service';
import { AppSettings } from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private _settings = signal<AppSettings>({
    show_schedule: true,
    show_map: true,
    show_feed: true,
    show_info: true
  });

  public settings = computed(() => this._settings());

  constructor(private directusService: DirectusService) { }

  async loadAppConfig(): Promise<void> {
    try {
      const settings = await this.directusService.getAppSettings();
      if (settings) {
        this._settings.set(settings);
      }
    } catch (error) {
      console.error('Failed to load app config', error);
      // Keep defaults
    }
  }
}
