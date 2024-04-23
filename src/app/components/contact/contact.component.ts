import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private formService: FormService, private formBuilder: FormBuilder, private dataService: DataService) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      action: ['email']
    });
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      let response = await lastValueFrom(this.dataService.submitFormData(this.contactForm.value));
      if (response.success) {
        this.formService.setPopupMessage("Message submitted successfully!")
        this.contactForm.reset();
      } else {
        this.formService.setPopupMessage("There was an issue submitting your message!");
      }
      this.formService.showPopup();
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
