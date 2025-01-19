import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormService } from 'src/app/services/form.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
})
export class DocumentViewerComponent {
  documentName: string = '';
  documentText: string = '';

  constructor(
    private route: ActivatedRoute,
    private formService: FormService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.documentName = params['documentName'];

      this.formService.setBannerMessage(
        this.documentName
          .split('-')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      );

      this.loadDocument();
    });
  }

  async loadDocument() {
    this.documentText = await this.dataService.processDocument(
      `${this.documentName}.html`
    );
  }
}
