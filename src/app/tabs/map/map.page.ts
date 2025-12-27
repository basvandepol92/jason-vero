import { Component, OnInit, signal, computed, inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonButton, IonIcon, IonModal, ViewDidEnter } from '@ionic/angular/standalone';
import { MapService } from '../../core/services/map.service';
import { LocationItem } from '../../models/app.models';
import { addIcons } from 'ionicons';
import { search, close, musicalNotes, restaurant, body as wc, star, podium } from 'ionicons/icons';
import * as L from 'leaflet';
import { DirectusImgPipe } from '../../shared/pipes/directus-img.pipe';
import { take } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonButton,
    IonIcon,
    IonModal,
    DirectusImgPipe,
    TitleCasePipe
  ],
  encapsulation: ViewEncapsulation.None // Needed for Leaflet styles
})
export class MapPage implements OnInit, OnDestroy, ViewDidEnter {
  private mapService = inject(MapService);

  private map: L.Map | undefined;
  private markersLayer: L.LayerGroup | undefined;

  public locations = signal<LocationItem[]>([]);
  public selectedFilter = signal<'all' | 'stage' | 'food' | 'toilet'>('all');

  // Interaction
  public selectedLocation = signal<LocationItem | null>(null);

  constructor() {
    addIcons({ search, close, 'musical-notes': musicalNotes, restaurant, body: wc, star, podium });
  }

  ngOnInit() {
    this.initMap();
    this.loadLocations();
  }

  ionViewDidEnter() {
    if (this.map) {
      this.map.invalidateSize();
      this.fitMapToHeight();
    }
  }

  private fitMapToHeight() {
    if (!this.map) return;
    const mapWidth = 1000;
    const mapHeight = 523.33;
    const bounds = L.latLngBounds([0, 0], [mapHeight, mapWidth]);

    // To fill height, we use getBoundsZoom with false (outside/cover)
    const fillZoom = this.map.getBoundsZoom(bounds, false);
    this.map.setView(bounds.getCenter(), fillZoom);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    const mapWidth = 1000;
    const mapHeight = 523.33;
    const bounds: L.LatLngBoundsExpression = [[0, 0], [mapHeight, mapWidth]];

    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -1,
      maxZoom: 3,
      zoomSnap: 0.1,
      attributionControl: false,
      zoomControl: false,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    const imageUrl = 'assets/map.jpg';
    L.imageOverlay(imageUrl, bounds).addTo(this.map);

    // Initial view
    this.map.setView(L.latLngBounds(bounds).getCenter(), 1);

    this.markersLayer = L.layerGroup().addTo(this.map);

    this.map.on('click', () => {
      this.selectedLocation.set(null);
    });

    setTimeout(() => {
      this.map?.invalidateSize();
      this.fitMapToHeight();
    }, 500);
  }

  loadLocations() {
    this.mapService.getLocations().pipe(take(1)).subscribe({
      next: (locs) => {
        this.locations.set(locs);
        this.renderMarkers();
      },
      error: (err) => console.error('Failed to load locations', err)
    });
  }

  setFilter(filter: 'all' | 'stage' | 'food' | 'toilet') {
    this.selectedFilter.set(filter);
    this.renderMarkers();
    this.selectedLocation.set(null);
  }

  private convertCoords(xPerc: number, yPerc: number): L.LatLng {
    const mapWidth = 1000;
    const mapHeight = 523.33;

    const lat = mapHeight - (yPerc * mapHeight / 100);
    const lng = xPerc * mapWidth / 100;
    return L.latLng(lat, lng);
  }

  renderMarkers() {
    if (!this.map || !this.markersLayer) return;

    this.markersLayer.clearLayers();

    const filter = this.selectedFilter();
    const items = this.locations().filter(l => {
      if (filter === 'all') return true;
      return l.type === filter;
    });

    items.forEach(loc => {
      if (loc.coord_x === undefined || loc.coord_y === undefined || loc.coord_x === null || loc.coord_y === null) {
        return;
      }

      const latLng = this.convertCoords(loc.coord_x, loc.coord_y);
      const iconHtml = this.getMarkerIconHtml(loc.type);

      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: iconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker(latLng, { icon: customIcon });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        this.selectedLocation.set(loc);
        this.map?.panTo(latLng);
      });

      marker.addTo(this.markersLayer!);
    });
  }

  getMarkerIconHtml(type: string): string {
    let iconName = 'star';
    let className = 'default';

    switch (type) {
      case 'stage': iconName = 'musical-notes'; className = 'stage'; break;
      case 'food': iconName = 'restaurant'; className = 'food'; break;
      case 'toilet': iconName = 'wc'; className = 'toilet'; break;
      case 'entrance': iconName = 'podium'; className = 'entrance'; break;
    }

    return `<div class="marker-bubble ${className}">
                <ion-icon name="${iconName}"></ion-icon>
              </div>`;
  }
}
