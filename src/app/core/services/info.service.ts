import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { InfoItem } from '../../models/app.models';

export interface GroupedInfo {
    [category: string]: InfoItem[];
}

@Injectable({
    providedIn: 'root'
})
export class InfoService {
    private api = inject(ApiService);

    /**
     * Fetches all info items from Directus, sorted by sort_order.
     */
    getInfoItems(): Observable<InfoItem[]> {
        return this.api.getItems<InfoItem>('info_items', {
            sort: 'sort_order',
            fields: ['*']
        });
    }

    /**
     * Fetches and groups info items by the 'category' field.
     */
    getGroupedInfo(): Observable<GroupedInfo> {
        return this.getInfoItems().pipe(
            map(items => {
                return items.reduce((acc: GroupedInfo, item) => {
                    const cat = item.category || 'other';
                    if (!acc[cat]) {
                        acc[cat] = [];
                    }
                    acc[cat].push(item);
                    return acc;
                }, {});
            })
        );
    }
}
