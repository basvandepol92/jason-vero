import { Component, OnInit, OnDestroy, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonIcon, IonButton, IonSkeletonText } from '@ionic/angular/standalone';
import { AppConfigService } from '../../services/app-config.service';
import { DirectusService } from '../../services/directus.service';
import { ScheduleItem } from '../../models/app.models';
import { addIcons } from 'ionicons';
import { ticket, map, globe, informationCircle, time, timeOutline, locationOutline } from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { DirectusImgPipe } from '../../shared/pipes/directus-img.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButton,
    IonSkeletonText,
    DirectusImgPipe
  ]
})
export class HomePage implements OnInit, OnDestroy {
  public appConfig = inject(AppConfigService);
  private directusService = inject(DirectusService);

  // Signals
  public happeningNow = signal<ScheduleItem | null>(null);
  public isLive = signal(false);
  public isLoadingHappeningNow = signal(true);

  // Countdown Signals
  public days = signal(0);
  public hours = signal(0);
  public minutes = signal(0);
  public seconds = signal(0);
  public isFestivalStarted = signal(false);

  private intervalId: any;

  constructor() {
    addIcons({
      ticket,
      map,
      globe,
      'information-circle': informationCircle,
      time,
      'time-outline': timeOutline,
      'location-outline': locationOutline
    });

    // Effect to start countdown when settings are loaded
    effect(() => {
      const settings = this.appConfig.settings();
      if (settings?.festival_start_date) {
        this.startCountdown(settings.festival_start_date);
      }
    });
  }

  ngOnInit() {
    this.loadHappeningNow();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async loadHappeningNow() {
    this.isLoadingHappeningNow.set(true);
    try {
      const schedule = await this.directusService.getScheduleItems();
      const now = new Date();
      const nowIso = now.toISOString();

      // 1. Check for current LIVE event
      const current = schedule.find(item => item.start_time <= nowIso && item.end_time >= nowIso);

      if (current) {
        this.happeningNow.set(current);
        this.isLive.set(true);
      } else {
        // 2. Check for next upcoming event
        const upcoming = schedule
          .filter(item => item.start_time > nowIso)
          .sort((a, b) => a.start_time.localeCompare(b.start_time));

        if (upcoming.length > 0) {
          this.happeningNow.set(upcoming[0]);
          this.isLive.set(false);
        } else {
          this.happeningNow.set(null);
          this.isLive.set(false);
        }
      }

    } catch (e) {
      console.error('Error loading schedule', e);
    } finally {
      this.isLoadingHappeningNow.set(false);
    }
  }

  startCountdown(startDateStr: string) {
    if (this.intervalId) clearInterval(this.intervalId);

    const targetDate = new Date(startDateStr).getTime();

    this.intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        this.isFestivalStarted.set(true);
        clearInterval(this.intervalId);
        this.days.set(0);
        this.hours.set(0);
        this.minutes.set(0);
        this.seconds.set(0);
        return;
      }

      this.days.set(Math.floor(distance / (1000 * 60 * 60 * 24)));
      this.hours.set(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      this.minutes.set(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      this.seconds.set(Math.floor((distance % (1000 * 60)) / 1000));
    }, 1000);
  }
}
