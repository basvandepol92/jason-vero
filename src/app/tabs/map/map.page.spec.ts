import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MapPage } from './map.page';
import { MapService } from '../../core/services/map.service';
import { APP_CONFIG } from '../../core/config/app-config.token';
import { LocationItem } from '../../models/app.models';
import { of } from 'rxjs';

describe('MapPage', () => {
  let component: MapPage;
  let fixture: ComponentFixture<MapPage>;
  let mockMapService: jasmine.SpyObj<MapService>;

  const mockLocations: LocationItem[] = [
    {
      id: 1,
      status: 'published',
      name: 'Main Stage',
      coord_x: 50,
      coord_y: 80,
      type: 'stage',
      description: 'Primary performance area'
    },
    {
      id: 2,
      status: 'published',
      name: 'Lodge',
      coord_x: 30,
      coord_y: 40,
      type: 'lodge'
    } as any as LocationItem
  ];

  beforeEach(() => {
    mockMapService = jasmine.createSpyObj('MapService', ['getLocations']);
    mockMapService.getLocations.and.returnValue(of(mockLocations));

    TestBed.configureTestingModule({
      imports: [MapPage],
      providers: [
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiUrl: 'http://localhost:8055' } },
        { provide: MapService, useValue: mockMapService }
      ]
    });

    fixture = TestBed.createComponent(MapPage);
    component = fixture.componentInstance;

    // Prevent actual Leaflet initialization which fails in test environment
    spyOn(component, 'initMap').and.stub();
    // Prevent markers rendering which uses Leaflet L.marker
    spyOn(component, 'renderMarkers').and.stub();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load locations on init', fakeAsync(() => {
    fixture.detectChanges(); // triggers ngOnInit -> loadLocations
    tick(); // allow observable to resolve

    expect(mockMapService.getLocations).toHaveBeenCalled();
    expect(component.locations().length).toBe(2);
    expect(component.renderMarkers).toHaveBeenCalled();
  }));

  it('should set filter', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.setFilter('lodge');
    expect(component.selectedFilter()).toBe('lodge');
    expect(component.selectedLocation()).toBeNull();
    // renderMarkers is called inside setFilter
    expect(component.renderMarkers).toHaveBeenCalledTimes(2); // Init + SetFilter
  }));

  it('should clear selection when setting filter', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.selectedLocation.set(mockLocations[0]);
    component.setFilter('stage');
    expect(component.selectedLocation()).toBeNull();
  }));
});
