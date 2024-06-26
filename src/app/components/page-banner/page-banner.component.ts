import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-page-banner',
  templateUrl: './page-banner.component.html',
  styleUrls: ['./page-banner.component.scss']
})
export class PageBannerComponent {
  bannerImage: any;
  message = '';

  imageUrl = '';

  constructor(private formService: FormService, private dataService: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.loadBannerImage();
    this.getBannerMessage();
  }

  getBannerMessage() {
    this.formService.getBannerMessage().subscribe((message: string) => {
      this.message = message;
    });
  }

  async loadBannerImage() {
    this.dataService.collectData("section-image", "page-banner").subscribe((data: any) => {
      this.bannerImage = data;
    });
  }
}
