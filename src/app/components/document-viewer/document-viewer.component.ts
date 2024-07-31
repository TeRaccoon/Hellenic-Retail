import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UrlService } from 'src/app/services/url.service'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent {
  documentUrl: SafeResourceUrl = '';

  constructor(
    private urlService: UrlService, 
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const document = params['documentName'];
      let uploadURL = this.urlService.getUrl('uploads');;
      // Sanitize the documentUrl
      this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(uploadURL + document + ".html");
    });
  }
}
