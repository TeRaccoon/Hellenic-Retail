import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { faHouse, faPhone, faEnvelope, faFileInvoice, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { RenderService } from 'src/app/services/render.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  faHouse = faHouse;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faFileInvoice = faFileInvoice;
  faHashtag = faHashtag;

  imageUrl = '';
  categories: any[] = [];

  screenSize: any = {};

  constructor(private dataService: DataService, private renderService: RenderService) { }

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.loadCategories();
    this.renderService.getScreenSize().subscribe(size => {
      this.screenSize = size;
    });
  }

  async loadCategories() {
    this.categories = await lastValueFrom(this.dataService.collectData("visible-categories"));
  }
}
