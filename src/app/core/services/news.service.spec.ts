import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NewsService } from './news.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { NewsItem } from '../../models/app.models';

describe('NewsService', () => {
    let service: NewsService;
    let mockApiService: jasmine.SpyObj<ApiService>;

    beforeEach(() => {
        mockApiService = jasmine.createSpyObj('ApiService', ['getItems']);

        TestBed.configureTestingModule({
            providers: [
                NewsService,
                { provide: ApiService, useValue: mockApiService }
            ]
        });
        service = TestBed.inject(NewsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get news items with correct filter and fields', fakeAsync(() => {
        mockApiService.getItems.and.returnValue(of([]));

        service.getNews().subscribe();
        tick();

        expect(mockApiService.getItems).toHaveBeenCalledWith('news', {
            sort: '-date_created',
            'filter[status][_eq]': 'published',
            fields: ['*', 'image.*']
        });
    }));
});
