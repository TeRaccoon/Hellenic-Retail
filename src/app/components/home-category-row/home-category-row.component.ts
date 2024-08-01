import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UrlService } from 'src/app/services/url.service'

@Component({
  selector: 'app-home-category-row',
  templateUrl: './home-category-row.component.html',
  styleUrls: ['./home-category-row.component.scss']
})
export class HomeCategoryRowComponent {
  categories: any[] = [];
  imageUrl = '';

  constructor(private urlService: UrlService, private dataService: DataService) { }

  ngOnInit() {
    this.imageUrl = this.urlService.getUrl('uploads');;
    this.getCategories();
  }

  async getCategories() {
    let categories = await this.dataService.processGet("visible-categories");
    if (categories != null) {
      this.categories = categories;
    }
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.imageUrl + 'placeholder.jpg';
  }
}
