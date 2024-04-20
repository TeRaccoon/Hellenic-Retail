import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent {
  imageUrl = "";
  visible = false;

  faX = faX;

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.formService.getImageViewerVisibility().subscribe(visible => {
      this.visible = visible;
      if (visible) {
        this.imageUrl = this.formService.getImageViewerUrl()
      }
    });
  }

  close() {
    this.formService.hideImageViewer();
  }
}
