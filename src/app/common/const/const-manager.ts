import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { UrlService } from 'src/app/services/url.service';

const SETTING_KEYS = [
  'free_delivery_minimum',
  'support_email',
  'support_phone',
  'address',
];

const DATA_KEYS = ['delivery_cost', 'delivery_item'];

export enum settingKeys {
  free_delivery_minimum = 'free_delivery_minimum',
  support_email = 'support_email',
  support_phone = 'support_phone',
  address = 'address',
}

export enum dataKeys {
  delivery_cost = 'delivery_cost',
  delivery_item = 'delivery_item',
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

    for (let key of DATA_KEYS) {
      this.consts[key] = await this.dataService.processGet(key);
    }
  }

  getConstant(key: settingKeys | dataKeys) {
    return this.consts[key];
  }
}
