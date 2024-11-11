import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

const SETTING_KEYS = ['free_delivery_minimum', 'support_email'];
export enum settingKeys {
  free_delivery_minimum = 'free_delivery_minimum',
  support_email = 'support_email',
}

@Injectable({
  providedIn: 'root',
})
export class ConstManager {
  private loaded = false;
  private consts: { [key: string]: any } = {};

  constructor(private dataService: DataService) {}

  async loadConstants() {
    for (let i = 0; i < SETTING_KEYS.length; i++) {
      this.consts[SETTING_KEYS[i]] = await this.dataService.processPost({
        action: 'settings',
        key: SETTING_KEYS[i],
      });
    }
  }

  getConstant(key: settingKeys) {
    return this.consts[key];
  }
}
