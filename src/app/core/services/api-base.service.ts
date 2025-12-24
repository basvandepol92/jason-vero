import { inject } from '@angular/core';
import { APP_CONFIG } from '../config/app-config.token';

export abstract class ApiBaseService {
    protected config = inject(APP_CONFIG);

    /**
     * Builds a full URL for a given endpoint.
     * @param endpoint The API endpoint (e.g., '/items/news').
     */
    protected getUrl(endpoint: string): string {
        // Ensure endpoint starts with a slash
        const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return `${this.config.apiUrl}${formattedEndpoint}`;
    }
}
