import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from 'src/app/services/form.service';
import { UrlService } from 'src/app/services/url.service'

@Component({
  selector: 'app-page-banner',
  templateUrl: './page-banner.component.html',
  styleUrls: ['./page-banner.component.scss']
})
export class PageBannerComponent {
  bannerImage: any;
  message = '';

  imageUrl = '';

  constructor(private urlService: UrlService, private formService: FormService, private dataService: DataService) { }

  ngOnInit() {
    this.imageUrl = this.urlService.getUrl('uploads');;
    this.loadBannerImage();
    this.getBannerMessage();
  }

  getBannerMessage() {
    this.formService.getBannerMessage().subscribe((message: string) => {
      this.message = message;
    });
  }

  async loadBannerImage() {
    this.bannerImage = this.dataService.processGet("section-image", {filter: "page-banner"})
  }
}
