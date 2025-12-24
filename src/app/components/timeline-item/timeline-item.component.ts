import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';
import { ScheduleItem } from '../../models/app.models';
import { addIcons } from 'ionicons';
import { musicalNotes, restaurant, mic, sparkles, fitness, helpCircleOutline, locationOutline, heart } from 'ionicons/icons';
import { ScheduleIconPipe } from '../../shared/pipes/schedule-icon.pipe';

@Component({
  selector: 'app-timeline-item',
  templateUrl: './timeline-item.component.html',
  styleUrls: ['./timeline-item.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, ScheduleIconPipe]
})
export class TimelineItemComponent {
  @Input({ required: true }) item!: ScheduleItem;
  @Input() isLive: boolean = false;
  @Input() isLast: boolean = false;
  @Output() clicked = new EventEmitter<void>();

  constructor() {
    addIcons({
      'musical-notes': musicalNotes,
      'fast-food': restaurant,
      mic,
      sparkles,
      fitness,
      'help-circle-outline': helpCircleOutline,
      'location-outline': locationOutline,
      heart
    });
  }

  getBadgeLabel(type?: string): string {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Event';
  }
}
