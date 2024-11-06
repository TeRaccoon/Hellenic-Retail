import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Injectable({
  providedIn: 'root',
})
export class ConstManager {
  private loaded = false;
  private consts: { [key: string]: any } = {};

  constructor(private dataService: DataService) {}

  async loadConstants() {
    this.consts['delivery_minimum'] = await this.dataService.processPost({
      action: 'delivery-minimum',
    });
  }

  async getConstant(key: string) {
    if (!this.loaded) await this.loadConstants();
    return this.consts[key];
  }
}
