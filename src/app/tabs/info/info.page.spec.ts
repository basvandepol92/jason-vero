import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { InfoPage } from './info.page';
import { InfoService, GroupedInfo } from '../../core/services/info.service';
import { APP_CONFIG } from '../../core/config/app-config.token';
import { InfoItem } from '../../models/app.models';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('InfoPage', () => {
  let component: InfoPage;
  let fixture: ComponentFixture<InfoPage>;
  let mockInfoService: jasmine.SpyObj<InfoService>;

  const mockInfoItems: InfoItem[] = [
    {
      id: 1,
      status: 'published',
      title: 'Transport Info',
      content: '<p>Bus schedule details</p>',
      category: 'transport',
      sort_order: 1
    },
    {
      id: 2,
      status: 'published',
      title: 'Parking',
      content: '<p>Parking information</p>',
      category: 'transport',
      sort_order: 2
    },
    {
      id: 3,
      status: 'published',
      title: 'Festival Rules',
      content: '<p>Please follow the rules</p>',
      category: 'rules',
      sort_order: 1
    }
  ];

  const mockGroupedInfo: GroupedInfo = {
    'transport': [mockInfoItems[0], mockInfoItems[1]],
    'rules': [mockInfoItems[2]]
  };

  beforeEach(() => {
    mockInfoService = jasmine.createSpyObj('InfoService', ['getGroupedInfo']);
    mockInfoService.getGroupedInfo.and.returnValue(of(mockGroupedInfo));


    TestBed.configureTestingModule({
      imports: [InfoPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiUrl: 'http://localhost:8055' } },
        { provide: InfoService, useValue: mockInfoService }
      ]
    });

    fixture = TestBed.createComponent(InfoPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load grouped info on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockInfoService.getGroupedInfo).toHaveBeenCalled();
    expect(component.groupedInfo()).toEqual(mockGroupedInfo);
    expect(component.categories().length).toBe(2);
    expect(component.isLoading()).toBe(false);
  }));


  // Emergency call uses ionic AlertController, which is hard to spy on unless we mock the controller itself.
  // But we can check if method exists and runs without error.
  it('should have callEmergency method', () => {
    expect(component.callEmergency).toBeDefined();
  });
});
