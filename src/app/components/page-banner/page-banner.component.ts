import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  imageUrl = '';

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.loadBannerImage();
    this.route.params.subscribe(params => {
      this.lastSegment = params['category'];
      this.fullPath = decodeURI(this.router.url);
    });
  }

  async loadBannerImage() {
    this.dataService.collectData("section-image", "page-banner").subscribe((data: any) => {
      this.bannerImage = data;
    });
  }
}
