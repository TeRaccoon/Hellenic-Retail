import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-page-banner',
  templateUrl: './page-banner.component.html',
  styleUrls: ['./page-banner.component.scss']
})
export class PageBannerComponent {
  bannerImage: any;
  lastSegment: string = '';
  fullPath: string = '';

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    let url = this.router.url;
    let urlArray = url.split('/');
    this.lastSegment = decodeURI(urlArray[urlArray.length - 1]);
    this.fullPath = decodeURI(url);
    this.loadBannerImage();
  }

  async loadBannerImage() {
    this.dataService.collectData("section-image", "page-banner").subscribe((data: any) => {
      this.bannerImage = data;
    });
  }
}
