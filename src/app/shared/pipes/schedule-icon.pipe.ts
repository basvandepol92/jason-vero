import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'scheduleIcon',
    standalone: true
})
export class ScheduleIconPipe implements PipeTransform {
    /**
     * Maps a Directus icon type to a valid Ionic icon name.
     * @param value The icon type from the database (e.g., 'food', 'music').
     */
    transform(value: string | undefined): string {
        if (!value) return 'help-circle-outline';

        const map: { [key: string]: string } = {
            'food': 'fast-food',
            'music': 'musical-notes',
            'speech': 'mic',
            'party': 'sparkles',
            'activity': 'fitness',
            'other': 'ellipse'
        };

        return map[value.toLowerCase()] || 'help-circle-outline';
    }
}
