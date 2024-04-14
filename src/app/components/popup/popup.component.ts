import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  visible = false;
  message = "";

  faX = faX;

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.checkVisibility();
  }

  checkVisibility() {
    this.formService.getPopupVisibility().subscribe((visible: boolean) => {
      this.visible = visible;
      if (visible) {
        this.message = this.formService.getPopupMessage();
        setTimeout(() => {
          this.formService.hidePopup();
        }, 3000);
      }
    });
  }
}
