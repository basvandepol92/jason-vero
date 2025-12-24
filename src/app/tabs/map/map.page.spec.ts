import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapPage } from './map.page';
import { DirectusService } from '../../services/directus.service';

describe('MapPage', () => {
  let component: MapPage;
  let fixture: ComponentFixture<MapPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MapPage],
      providers: [
        {
          provide: DirectusService,
          useValue: { getLocationItems: () => Promise.resolve([]) }
        }
      ]
    });
    fixture = TestBed.createComponent(MapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
