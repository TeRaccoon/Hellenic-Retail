import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { ConstManager, settingKeys } from 'src/app/common/const/const-manager';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  contactForm: FormGroup;

  supportEmail;
  supportPhone;
  address;

  constructor(
    private formService: FormService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private consts: ConstManager
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      action: ['email'],
    });

    this.supportEmail = this.consts.getConstant(settingKeys.support_email);
    this.supportPhone = this.consts.getConstant(settingKeys.support_phone);
    this.address = this.consts.getConstant(settingKeys.address);
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      let response = await lastValueFrom(
        this.dataService.submitFormData(this.contactForm.value)
      );
      if (response.success) {
        this.formService.setPopupMessage('Message submitted successfully!');
        this.contactForm.reset();
      } else {
        this.formService.setPopupMessage(
          'There was an issue submitting your message!'
        );
      }
      this.formService.showPopup();
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
