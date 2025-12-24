import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiBaseService } from './api-base.service';

interface DirectusResponse<T> {
    data: T;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService extends ApiBaseService {
    private http = inject(HttpClient);

    /**
     * Fetches items from a Directus collection.
     * @param collection The name of the collection (e.g. 'news').
     * @param query Optional query parameters in Directus format (e.g. { sort: '-publish_date' }).
     */
    getItems<T>(collection: string, query?: any): Observable<T[]> {
        let params = new HttpParams();

        if (query) {
            // Simple mapping of object keys to query params
            Object.keys(query).forEach(key => {
                const value = query[key];
                if (Array.isArray(value)) {
                    value.forEach(v => params = params.append(`${key}[]`, v));
                } else {
                    params = params.set(key, value);
                }
            });
        }

        return this.http.get<DirectusResponse<T[]>>(this.getUrl(`/items/${collection}`), { params }).pipe(
            map(response => response.data)
        );
    }

    /**
     * Fetches a singleton from Directus.
     * @param collection The name of the singleton collection.
     */
    getSingleton<T>(collection: string): Observable<T> {
        return this.http.get<DirectusResponse<T>>(this.getUrl(`/items/${collection}`)).pipe(
            map(response => response.data)
        );
    }
}
