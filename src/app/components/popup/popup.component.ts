import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  animations: [
    trigger('popAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50%) translateY(20%)' }),
        animate('0.3s ease-in-out', style({ opacity: 1, transform: 'translateX(-50%) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in-out', style({ opacity: 0, transform: 'translateX(-50%) translateY(20%)' }))
      ])
    ])
  ]
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
      let popupTime = this.formService.getPopupTime();
      this.visible = visible;
      if (visible) {
        this.message = this.formService.getPopupMessage();
        setTimeout(() => {
          this.formService.hidePopup();
        }, popupTime);
      }
    });
  }
}
