import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UrlService } from 'src/app/services/url.service';
import { Card } from 'src/app/common/types/sections';

@Component({
  selector: 'app-home-card-section-a',
  templateUrl: './home-card-section-a.component.html',
  styleUrls: ['./home-card-section-a.component.scss'],
})
export class HomeCardSectionAComponent {
  card1: Card[] | undefined = undefined;
  card2: Card[] | undefined = undefined;
  cardLocations: any[] = [];

  imageUrl = '';

  constructor(
    private urlService: UrlService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.loadSections();
    this.imageUrl = this.urlService.getUrl('uploads');
  }

  async loadSections() {
    this.card1 = await this.dataService.processGet('section-data', {
      filter: 'home-section-A-card-1',
    });
    this.cardLocations.push(this.card1![0].image_file_name);

    this.card2 = await this.dataService.processGet('section-data', {
      filter: 'home-section-A-card-2',
    });
    this.cardLocations.push(this.card2![0].image_file_name);
  }
}
