import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home-card-section-a',
  templateUrl: './home-card-section-a.component.html',
  styleUrls: ['./home-card-section-a.component.scss']
})
export class HomeCardSectionAComponent {
  card1: any;
  card2: any;
  cardLocations: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadSections();
  }

  async loadSections() {
    this.dataService.collectData("section-data", "home-section-A-card-1").subscribe((data: any) => {
      this.card1 = data;
      this.cardLocations.push(this.card1[0].image_file_name);
    });
    this.dataService.collectData("section-data", "home-section-A-card-2").subscribe((data: any) => {
      this.card2 = data;
      this.cardLocations.push(this.card2[0].image_file_name);
      console.log(this.cardLocations);
    });
  }
}
