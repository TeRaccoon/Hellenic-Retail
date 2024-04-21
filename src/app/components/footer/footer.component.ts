import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';
import { faHouse, faPhone, faEnvelope, faFileInvoice, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';


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

  constructor(private dataService: DataService, private formService: FormService) { }

  ngOnInit() {
    this.imageUrl = this.dataService.getUploadURL();
    this.loadCategories();
  }

  async loadCategories() {
    this.categories = await lastValueFrom(this.dataService.collectData("visible-categories"));
  }
}
