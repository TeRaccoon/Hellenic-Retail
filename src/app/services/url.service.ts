import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

const API_EXTENSION = 'API/';
const UPLOAD_EXTENSION = 'uploads/';
const DATA_PATH = API_EXTENSION + 'manage_data.php';
const MAIL_PATH = API_EXTENSION + 'mail.php';
const RETAIL_PATH = API_EXTENSION + 'retail_query_handler.php';
const PAYMENT_PATH = API_EXTENSION + 'payment.php';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  HOST_NAME = 'http://localhost/';

  constructor(private config: ConfigService) {
    this.loadConfig();
  }

  async loadConfig() {
    this.HOST_NAME = this.config.getConfig().host;
  }

  getUrl(extension = 'api', full = true) {
    var url = full ? HOST_NAME : '';
    switch (extension) {
      case 'uploads':
        return (url += UPLOAD_EXTENSION);
      case 'data':
        return (url += DATA_PATH);
      case 'mail':
        return (url += MAIL_PATH);
      case 'retail':
        return (url += RETAIL_PATH);
      case 'payment':
        return (url += PAYMENT_PATH);
      default:
        return (url += API_EXTENSION);
    }
  }
}
