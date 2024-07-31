import { Injectable } from '@angular/core';

const HOST_NAME = 'http://localhost/';
const API_EXTENSION = 'API/';
const UPLOAD_EXTENSION = 'uploads/';
const DATA_PATH = API_EXTENSION + 'manage_data.php'
const MAIL_PATH = API_EXTENSION + 'mail.php';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() { }

  getUrl(extension = 'api', full = true) {
    var url = (full ? HOST_NAME : '');
    switch (extension) {
      case 'uploads':
        return url += UPLOAD_EXTENSION;
      case 'data':
        return url += DATA_PATH;
      case 'mail':
        return url += MAIL_PATH;
      default:
        return url += API_EXTENSION;
    }
  }
}
