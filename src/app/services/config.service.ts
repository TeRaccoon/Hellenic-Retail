import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: any;
  private loaded = false;

  constructor(private http: HttpClient) {}

  async loadConfig() {
    this.config = await lastValueFrom(this.http.get(environment.configUrl));
    this.loaded = true;
  }

  async getConfig() {
    if (!this.loaded) {
      await this.loadConfig();
    }

    return this.config;
  }
}
