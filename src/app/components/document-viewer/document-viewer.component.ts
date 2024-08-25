import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UrlService } from 'src/app/services/url.service'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormService } from 'src/app/services/form.service';

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
    private sanitizer: DomSanitizer,
    private formService: FormService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const document = params['documentName'];

      this.formService.setBannerMessage(document
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '));
      let uploadURL = this.urlService.getUrl('uploads');;
      this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(uploadURL + document + ".html");
    });
  }
}
