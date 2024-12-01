import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UrlService } from 'src/app/services/url.service';

const SETTING_KEYS = [
  'free_delivery_minimum',
  'support_email',
  'support_phone',
  'address',
];
export enum settingKeys {
  free_delivery_minimum = 'free_delivery_minimum',
  support_email = 'support_email',
  support_phone = 'support_phone',
  address = 'address',
}

@Injectable({
  providedIn: 'root',
})
export class ConstManager {
  private consts: { [key: string]: any } = {};

  constructor(
    private dataService: DataService,
    private urlService: UrlService
  ) {}

  async loadConstants() {
    if (!this.urlService.HOST_NAME) {
      await this.urlService.loadConfig();
    }

    for (let key of SETTING_KEYS) {
      this.consts[key] = await this.dataService.processPost({
        action: 'settings',
        key: key,
      });
    }
  }

  getConstant(key: settingKeys) {
    return this.consts[key];
  }
}
