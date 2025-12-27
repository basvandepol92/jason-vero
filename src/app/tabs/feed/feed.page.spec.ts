import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { FeedPage } from './feed.page';
import { NewsService } from '../../core/services/news.service';
import { APP_CONFIG } from '../../core/config/app-config.token';
import { NewsItem } from '../../models/app.models';
import { of } from 'rxjs';

describe('FeedPage', () => {
  let component: FeedPage;
  let fixture: ComponentFixture<FeedPage>;
  let mockNewsService: jasmine.SpyObj<NewsService>;

  const mockNewsItems: NewsItem[] = [
    {
      id: 1,
      status: 'published',
      date_created: '2025-01-01T10:00:00Z',
      title: 'Breaking News',
      content: '<p>Important update</p>',
      publish_date: '2025-01-01T10:00:00Z',
      is_pinned: true
    },
    {
      id: 2,
      status: 'published',
      date_created: '2025-01-02T10:00:00Z',
      title: 'Regular News',
      content: '<p>Regular update</p>',
      publish_date: '2025-01-02T10:00:00Z',
      is_pinned: false
    }
  ];

  beforeEach(() => {
    mockNewsService = jasmine.createSpyObj('NewsService', ['getNews']);
    mockNewsService.getNews.and.returnValue(of(mockNewsItems));

    TestBed.configureTestingModule({
      imports: [FeedPage],
      providers: [
        provideHttpClient(),
        { provide: APP_CONFIG, useValue: { apiUrl: 'http://localhost:8055' } },
        { provide: NewsService, useValue: mockNewsService }
      ]
    });

    fixture = TestBed.createComponent(FeedPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load news items on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockNewsService.getNews).toHaveBeenCalled();
    expect(component.newsItems().length).toBe(2);
    expect(component.isLoading()).toBe(false);
  }));

  it('should sort news items (pinned first)', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const sorted = component.sortedNews();
    expect(sorted.length).toBe(2);
    expect(sorted[0].id).toBe(1); // Pinned (Breaking News)
    expect(sorted[1].id).toBe(2); // Regular
  }));

  it('should handle refresh', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const refreshEvent = {
      target: {
        complete: jasmine.createSpy('complete')
      }
    };

    component.handleRefresh(refreshEvent);
    tick();

    expect(mockNewsService.getNews).toHaveBeenCalledTimes(2); // Init + Refresh
    expect(refreshEvent.target.complete).toHaveBeenCalled();
  }));
});
