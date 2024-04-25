import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent {
  documentUrl: SafeResourceUrl = '';

  constructor(
    private route: ActivatedRoute, 
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const document = params['documentName'];
      let uploadURL = this.dataService.getUploadURL();
      // Sanitize the documentUrl
      this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(uploadURL + document + ".html");
    });
  }
}
