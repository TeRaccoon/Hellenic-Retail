import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import {
  faHouse,
  faPhone,
  faEnvelope,
  faFileInvoice,
  faHashtag,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import { RenderService } from 'src/app/services/render.service';
import { UrlService } from 'src/app/services/url.service';
import { ConstManager, settingKeys } from 'src/app/common/const/const-manager';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  faHouse = faHouse;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faFileInvoice = faFileInvoice;
  faHashtag = faHashtag;
  faCaretDown = faCaretDown;

  imageUrl = '';
  categories: any[] = [];

  screenSize: any = {};

  options = ['Shop', 'Quick Links', 'About Us', 'Customer Care'];
  openedOptions: any[] = [];

  supportEmail = '';

  constructor(
    private consts: ConstManager,
    private urlService: UrlService,
    private dataService: DataService,
    private renderService: RenderService
  ) {
    this.supportEmail = this.consts.getConstant(settingKeys.support_email);
  }

  ngOnInit() {
    this.imageUrl = this.urlService.getUrl('uploads');
    this.loadCategories();
    this.renderService.getScreenSize().subscribe((size) => {
      this.screenSize = size;
    });
  }

  async loadCategories() {
    this.categories = await this.dataService.processGet('visible-categories');
  }

  openDropdown(option: string) {
    if (this.openedOptions.includes(option)) {
      this.openedOptions = this.openedOptions.filter(
        (openedOption) => openedOption !== option
      );
    } else {
      this.openedOptions.push(option);
    }
  }
}
