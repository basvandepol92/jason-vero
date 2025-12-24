import { Component, OnInit, signal, computed, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonButtons, IonDatetime } from '@ionic/angular/standalone';
import { ScheduleService, GroupedSchedule } from '../../core/services/schedule.service';
import { take } from 'rxjs';
import { ScheduleItem } from '../../models/app.models';
import { TimelineItemComponent } from '../../components/timeline-item/timeline-item.component';
import { addIcons } from 'ionicons';
import { map as mapIcon, close } from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { DirectusImgPipe } from '../../shared/pipes/directus-img.pipe';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonSegment, IonSegmentButton, IonLabel,
    IonFab, IonFabButton, IonIcon,
    IonModal, IonButton, IonButtons,
    TimelineItemComponent,
    DirectusImgPipe
  ]
})
export class SchedulePage implements OnInit, OnDestroy {
  private scheduleService = inject(ScheduleService);

  public groupedSchedule = signal<GroupedSchedule>({});
  public days = computed(() => Object.keys(this.groupedSchedule()));
  public selectedDay = signal<string>('');

  // Modal state
  public isModalOpen = signal(false);
  public selectedItem = signal<ScheduleItem | null>(null);

  // Live state
  private intervalId: any;
  public currentTime = signal(new Date());

  public displayedItems = computed(() => {
    const day = this.selectedDay();
    return this.groupedSchedule()[day] || [];
  });

  constructor() {
    addIcons({ 'map': mapIcon, close });
  }

  ngOnInit() {
    this.loadSchedule();
    // Update current time every minute to refresh live status
    this.intervalId = setInterval(() => {
      this.currentTime.set(new Date());
    }, 60000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  loadSchedule() {
    this.scheduleService.getGroupedSchedule().pipe(take(1)).subscribe({
      next: (grouped) => {
        this.groupedSchedule.set(grouped);
        const days = Object.keys(grouped);

        if (days.length > 0) {
          // Try to select current day or the first available
          const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
          if (days.includes(weekday)) {
            this.selectedDay.set(weekday);
          } else {
            this.selectedDay.set(days[0]);
          }
        }
      },
      error: (err) => console.error('Error loading schedule', err)
    });
  }

  dayChanged(event: any) {
    this.selectedDay.set(event.detail.value);
  }

  checkLive(item: ScheduleItem): boolean {
    const now = this.currentTime().getTime();
    const start = new Date(item.start_time).getTime();
    const end = new Date(item.end_time).getTime();
    return now >= start && now < end;
  }

  openDetails(item: ScheduleItem) {
    this.selectedItem.set(item);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
