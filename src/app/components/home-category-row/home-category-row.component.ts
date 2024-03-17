import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home-category-row',
  templateUrl: './home-category-row.component.html',
  styleUrls: ['./home-category-row.component.scss']
})
export class HomeCategoryRowComponent {
  categories: any[] = [];
  imageUrl = '';

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.getCategories();
  }

  async getCategories() {
    let categories = await lastValueFrom(this.dataService.collectData("visible-categories"));
    if (categories != null) {
      this.categories = categories;
    }
  }
}
