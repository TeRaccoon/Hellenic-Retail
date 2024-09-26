import { Injectable } from '@angular/core';
import { Category, SubCategory } from '../common/types/cache';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  categories: Category[] | null = null;
  subCategories: SubCategory[] | null = null;
  cacheLoaded = false;

  constructor(private dataService: DataService) {
    this.loadCache();
  }

  async loadCache() {
    this.categories = await this.dataService.processGet('visible-categories');
    this.subCategories = await this.dataService.processGet('subcategories');
    this.cacheLoaded = true;
  }

  async getCategories(): Promise<Category[]> {
    if (this.cacheLoaded && this.categories) {
      return this.categories;
    } else {
      await this.loadCache();
      return this.categories ?? [];
    }
  }

  async getSubCategories(): Promise<SubCategory[]> {
    if (this.cacheLoaded && this.subCategories) {
      return this.subCategories;
    } else {
      await this.loadCache();
      return this.subCategories ?? [];
    }
  }
}
