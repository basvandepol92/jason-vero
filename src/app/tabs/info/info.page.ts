import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonButton, IonIcon, AlertController, IonList, IonCard, IonText } from '@ionic/angular/standalone';
import { InfoService, GroupedInfo } from '../../core/services/info.service';
import { addIcons } from 'ionicons';
import { callOutline, alertCircleOutline, carOutline, bookOutline, helpCircleOutline, personOutline, chevronDownOutline, notificationsOutline, checkmarkCircle } from 'ionicons/icons';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonList,
    IonCard,
    IonText
  ]
})
export class InfoPage implements OnInit {
  private infoService = inject(InfoService);
  private alertCtrl = inject(AlertController);

  public groupedInfo = signal<GroupedInfo>({});
  public isLoading = signal(true);

  // Translation map for categories
  public categoryLabels: { [key: string]: { label: string, icon: string } } = {
    'transport': { label: 'Vervoer & Parkeren', icon: 'car-outline' },
    'rules': { label: 'Huisregels', icon: 'book-outline' },
    'faq': { label: 'Veelgestelde Vragen', icon: 'help-circle-outline' },
    'contact': { label: 'Contact', icon: 'person-outline' },
    'other': { label: 'Overige Info', icon: 'alert-circle-outline' }
  };

  public categories = signal<string[]>([]);

  constructor() {
    addIcons({
      callOutline,
      alertCircleOutline,
      carOutline,
      bookOutline,
      helpCircleOutline,
      personOutline,
      'chevron-down-outline': chevronDownOutline
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.infoService.getGroupedInfo().subscribe({
      next: (data) => {
        this.groupedInfo.set(data);
        this.categories.set(Object.keys(data));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading info items', err);
        this.isLoading.set(false);
      }
    });
  }


  async callEmergency() {
    const alert = await this.alertCtrl.create({
      header: 'NOODGEVAL / EHBO',
      message: 'Bel onmiddellijk 112 bij levensbedreigende situaties of ga direct naar de EHBO post bij de hoofdingang.',
      buttons: ['OK'],
      cssClass: 'emergency-alert'
    });
    await alert.present();
  }
}
