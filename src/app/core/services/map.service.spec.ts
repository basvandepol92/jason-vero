import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MapService } from './map.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { LocationItem } from '../../models/app.models';

describe('MapService', () => {
    let service: MapService;
    let mockApiService: jasmine.SpyObj<ApiService>;

    const mockLocations: LocationItem[] = [
        {
            id: 1,
            status: 'published',
            name: 'Stage 1',
            coord_x: 10,
            coord_y: 20,
            type: 'stage'
        }
    ];

    beforeEach(() => {
        mockApiService = jasmine.createSpyObj('ApiService', ['getItems']);
        mockApiService.getItems.and.returnValue(of(mockLocations));

        TestBed.configureTestingModule({
            providers: [
                MapService,
                { provide: ApiService, useValue: mockApiService }
            ]
        });
        service = TestBed.inject(MapService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get locations with fields', fakeAsync(() => {
        service.getLocations().subscribe(locs => {
            expect(locs.length).toBe(1);
        });
        tick();

        expect(mockApiService.getItems).toHaveBeenCalledWith('map_locations', {
            fields: ['*', 'image.*']
        });
    }));
});
