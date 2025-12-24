import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { LocationItem } from '../../models/app.models';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    private api = inject(ApiService);

    /**
     * Fetches all map locations from Directus.
     */
    getLocations(): Observable<LocationItem[]> {
        return this.api.getItems<LocationItem>('map_locations', {
            fields: ['*', 'image.*']
        });
    }
}
