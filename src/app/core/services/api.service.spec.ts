import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { APP_CONFIG } from '../config/app-config.token';

describe('ApiService', () => {
    let service: ApiService;
    let httpMock: HttpTestingController;
    const apiUrl = 'http://localhost:8055';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ApiService,
                { provide: APP_CONFIG, useValue: { apiUrl } }
            ]
        });
        service = TestBed.inject(ApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get items from Directus unwrapped', () => {
        const mockResponse = { data: [{ id: 1, title: 'Test' }] };

        service.getItems<any>('news').subscribe(items => {
            expect(items.length).toBe(1);
            expect(items[0].title).toBe('Test');
        });

        const req = httpMock.expectOne(`${apiUrl}/items/news`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should get singleton from Directus unwrapped', () => {
        const mockResponse = { data: { id: 1, title: 'Test' } };

        service.getSingleton<any>('globals').subscribe(item => {
            expect(item.id).toBe(1);
        });

        const req = httpMock.expectOne(`${apiUrl}/items/globals`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should handle query params', () => {
        const mockResponse = { data: [] };

        service.getItems('news', { limit: 5 }).subscribe();

        const req = httpMock.expectOne(req => req.url.includes('/items/news') && req.params.has('limit'));
        expect(req.request.params.get('limit')).toBe('5');
        req.flush(mockResponse);
    });
});
