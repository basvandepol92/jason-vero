import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { InfoService } from './info.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { InfoItem } from '../../models/app.models';

describe('InfoService', () => {
    let service: InfoService;
    let mockApiService: jasmine.SpyObj<ApiService>;

    const mockItems: InfoItem[] = [
        {
            id: 1,
            status: 'published',
            title: 'Bus',
            content: 'Bus info',
            category: 'transport',
            sort_order: 1
        }
    ];

    beforeEach(() => {
        mockApiService = jasmine.createSpyObj('ApiService', ['getItems']);
        mockApiService.getItems.and.returnValue(of(mockItems));

        TestBed.configureTestingModule({
            providers: [
                InfoService,
                { provide: ApiService, useValue: mockApiService }
            ]
        });
        service = TestBed.inject(InfoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get info items with sort and fields', fakeAsync(() => {
        service.getInfoItems().subscribe();
        tick();

        expect(mockApiService.getItems).toHaveBeenCalledWith('info_items', {
            sort: 'sort_order',
            fields: ['*']
        });
    }));

    it('should group items by category', fakeAsync(() => {
        service.getGroupedInfo().subscribe(grouped => {
            expect(Object.keys(grouped).length).toBe(1);
            expect(grouped['transport'].length).toBe(1);
        });
        tick();
    }));
});
