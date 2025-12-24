import { Pipe, PipeTransform, inject } from '@angular/core';
import { APP_CONFIG } from '../../core/config/app-config.token';

@Pipe({
    name: 'directusImg',
    standalone: true
})
export class DirectusImgPipe implements PipeTransform {
    private config = inject(APP_CONFIG);

    /**
     * Transforms a Directus image ID into a full URL.
     * @param imageId The ID of the image in Directus.
     * @param transform Optional transformation parameters (e.g., width=400 or key=thumbnail).
     */
    transform(input: string | any | undefined | null, transform?: string): string {
        if (!input) {
            return 'assets/images/placeholder.jpg';
        }

        // Handle if input is a Directus file object instead of just the ID string
        const imageId = typeof input === 'object' ? input.id : input;

        if (!imageId) {
            return 'assets/images/placeholder.jpg';
        }

        let url = `${this.config.apiUrl}/assets/${imageId}`;

        if (transform) {
            // Check if it's a named transformation key or a query string
            const separator = transform.includes('=') || transform.startsWith('?') ? '' : '?key=';
            const prefix = transform.startsWith('?') ? '' : (separator ? '' : '?');
            url += `${prefix}${separator}${transform}`;
        }

        return url;
    }
}
