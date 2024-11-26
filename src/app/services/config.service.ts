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

  constructor(private http: HttpClient) {
    // this.loadConfig();
  }

  async loadConfig() {
    this.config = await lastValueFrom(this.http.get(environment.configUrl));
    this.loaded = true;
    console.log('config loaded');
  }

  async getConfig() {
    if (!this.loaded) {
      console.log('waiting');
      await this.loadConfig();
    }
    console.log('done waiting');

    return this.config;
  }

  isLoaded() {
    return this.loaded;
  }
}
