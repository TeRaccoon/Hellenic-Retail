import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home-category-row',
  templateUrl: './home-category-row.component.html',
  styleUrls: ['./home-category-row.component.scss']
})
export class HomeCategoryRowComponent {
  categories: string[] = [];
  imageUrl = '';

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.loadData();
  }
  async loadData() {
    this.dataService.collectData("categories").subscribe((data: any) => {
      this.categories = data;
    });
  }
}
