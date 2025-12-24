import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedPage } from './feed.page';
import { DirectusService } from '../../services/directus.service';

describe('FeedPage', () => {
  let component: FeedPage;
  let fixture: ComponentFixture<FeedPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FeedPage],
      providers: [
        {
          provide: DirectusService,
          useValue: { getNewsItems: () => Promise.resolve([]) }
        }
      ]
    });
    fixture = TestBed.createComponent(FeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
