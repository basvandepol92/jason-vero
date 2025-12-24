import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { NewsItem } from '../../models/app.models';

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    private api = inject(ApiService);

    /**
     * Fetches all published news items from Directus, sorted by date_created (descending).
     */
    getNews(): Observable<NewsItem[]> {
        return this.api.getItems<NewsItem>('news', {
            sort: '-date_created',
            'filter[status][_eq]': 'published',
            fields: ['*', 'image.*'] // Ensure we get image data
        });
    }
}
