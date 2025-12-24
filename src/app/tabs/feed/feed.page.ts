import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonRefresher, IonRefresherContent, IonSkeletonText, IonIcon } from '@ionic/angular/standalone';
import { NewsService } from '../../core/services/news.service';
import { NewsItem } from '../../models/app.models';
import { addIcons } from 'ionicons';
import { pin, timeOutline } from 'ionicons/icons';
import { DirectusImgPipe } from '../../shared/pipes/directus-img.pipe';
import { take } from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonRefresher, IonRefresherContent,
    IonSkeletonText, IonIcon,
    DirectusImgPipe
  ]
})
export class FeedPage implements OnInit {
  private newsService = inject(NewsService);

  public newsItems = signal<NewsItem[]>([]);
  public isLoading = signal(true);

  public sortedNews = computed(() => {
    return [...this.newsItems()].sort((a, b) => {
      // Sort pinned first
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      // Then by date_created (nieuwste bovenaan)
      const dateA = new Date(a.date_created).getTime();
      const dateB = new Date(b.date_created).getTime();
      return dateB - dateA;
    });
  });

  constructor() {
    addIcons({ pin, 'time-outline': timeOutline });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(event?: any) {
    if (!event) this.isLoading.set(true);

    this.newsService.getNews().pipe(take(1)).subscribe({
      next: (news) => {
        this.newsItems.set(news);
        this.isLoading.set(false);
        if (event) event.target.complete();
      },
      error: (err) => {
        console.error('Error fetching news', err);
        this.isLoading.set(false);
        if (event) event.target.complete();
      }
    });
  }

  handleRefresh(event: any) {
    this.loadData(event);
  }
}
