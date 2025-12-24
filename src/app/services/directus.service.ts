import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { AppSettings, NewsItem, ScheduleItem, LocationItem, InfoItem } from '../models/app.models';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectusService {
  private api = inject(ApiService);

  async getAppSettings(): Promise<AppSettings> {
    try {
      return await lastValueFrom(this.api.getSingleton<AppSettings>('globals'));
    } catch (error) {
      console.warn('Could not load settings from Directus, using defaults.', error);
      return {
        show_schedule: true,
        show_map: true,
        show_feed: true,
        show_info: true,
        event_name: 'Jason & Vero 12.5 Fest'
      };
    }
  }

  async getNewsItems(): Promise<NewsItem[]> {
    return lastValueFrom(this.api.getItems<NewsItem>('news', {
      sort: '-publish_date'
    }));
  }

  async getScheduleItems(): Promise<ScheduleItem[]> {
    return lastValueFrom(this.api.getItems<ScheduleItem>('schedule', {
      sort: 'start_time'
    }));
  }

  async getLocationItems(): Promise<LocationItem[]> {
    return lastValueFrom(this.api.getItems<LocationItem>('map_locations'));
  }

  async getInfoItems(): Promise<InfoItem[]> {
    return lastValueFrom(this.api.getItems<InfoItem>('info_items', {
      sort: 'sort_order'
    }));
  }
}
