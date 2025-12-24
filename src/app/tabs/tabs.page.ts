import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, newspaper, calendar, map, informationCircle } from 'ionicons/icons';
import { AppConfigService } from '../services/app-config.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  public appConfig = inject(AppConfigService);

  constructor() {
    addIcons({ home, newspaper, calendar, map, 'information-circle': informationCircle });
  }
}
