import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ScheduleService } from './schedule.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { ScheduleItem } from '../../models/app.models';

describe('ScheduleService', () => {
    let service: ScheduleService;
    let mockApiService: jasmine.SpyObj<ApiService>;

    const mockItems: ScheduleItem[] = [
        {
            id: 2,
            status: 'published',
            title: 'Early Event',
            start_time: '2025-12-25T18:00:00Z',
            end_time: '2025-12-25T19:00:00Z',
            location: 'Stage B',
            day: 'Friday',
            icon_type: 'food'
        },
        {
            id: 1,
            status: 'published',
            title: 'Late Event',
            start_time: '2025-12-25T20:00:00Z',
            end_time: '2025-12-25T21:00:00Z',
            location: 'Stage A',
            day: 'Friday',
            icon_type: 'music'
        },
        {
            id: 3,
            status: 'published',
            title: 'Next Day Event',
            start_time: '2025-12-26T10:00:00Z',
            end_time: '2025-12-26T11:00:00Z',
            location: 'Stage A',
            day: 'Saturday',
            icon_type: 'activity'
        }
    ];

    beforeEach(() => {
        mockApiService = jasmine.createSpyObj('ApiService', ['getItems']);
        mockApiService.getItems.and.returnValue(of(mockItems));

        TestBed.configureTestingModule({
            providers: [
                ScheduleService,
                { provide: ApiService, useValue: mockApiService }
            ]
        });
        service = TestBed.inject(ScheduleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should request sorted data with fields', fakeAsync(() => {
        service.getSchedule().subscribe();
        tick();

        expect(mockApiService.getItems).toHaveBeenCalledWith('schedule', {
            sort: 'start_time',
            fields: ['*', 'image.*']
        });
    }));

    it('should group returned items', fakeAsync(() => {
        service.getGroupedSchedule().subscribe(grouped => {
            expect(Object.keys(grouped).length).toBe(2);
            expect(grouped['Friday'].length).toBe(2);
        });
        tick();
    }));
});
