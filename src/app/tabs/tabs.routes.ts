import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { featureFlagGuard } from '../guards/feature-flag.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage)
      },
      {
        path: 'feed',
        loadComponent: () => import('./feed/feed.page').then(m => m.FeedPage),
        canActivate: [featureFlagGuard],
        data: { flag: 'show_feed' }
      },
      {
        path: 'schedule',
        loadComponent: () => import('./schedule/schedule.page').then(m => m.SchedulePage),
        canActivate: [featureFlagGuard],
        data: { flag: 'show_schedule' }
      },
      {
        path: 'map',
        loadComponent: () => import('./map/map.page').then(m => m.MapPage),
        canActivate: [featureFlagGuard],
        data: { flag: 'show_map' }
      },
      {
        path: 'info',
        loadComponent: () => import('./info/info.page').then(m => m.InfoPage),
        canActivate: [featureFlagGuard],
        data: { flag: 'show_info' }
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
