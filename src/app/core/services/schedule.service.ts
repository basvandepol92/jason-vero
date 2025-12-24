import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { ScheduleItem } from '../../models/app.models';

export interface GroupedSchedule {
    [day: string]: ScheduleItem[];
}

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    private api = inject(ApiService);

    /**
     * Fetches all schedule items from Directus, sorted by start_time.
     */
    getSchedule(): Observable<ScheduleItem[]> {
        return this.api.getItems<ScheduleItem>('schedule', {
            sort: 'start_time',
            fields: ['*', 'image.*']
        });
    }

    /**
     * Fetches and groups schedule items by the 'day' field.
     */
    getGroupedSchedule(): Observable<GroupedSchedule> {
        return this.getSchedule().pipe(
            map(items => {
                return items.reduce((acc: GroupedSchedule, item) => {
                    const day = item.day || 'Other';
                    if (!acc[day]) {
                        acc[day] = [];
                    }
                    acc[day].push(item);
                    return acc;
                }, {});
            })
        );
    }
}
