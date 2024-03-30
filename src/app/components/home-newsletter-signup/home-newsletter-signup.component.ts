import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-newsletter-signup',
  templateUrl: './home-newsletter-signup.component.html',
  styleUrls: ['./home-newsletter-signup.component.scss']
})
export class HomeNewsletterSignupComponent {
  signupForm: FormGroup;

  signupImage: any;
  imageUrl = '';

  invalid = false;
  submitted = false;

  faCheck = faCheck;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.signupForm.addControl('action', this.fb.control('add'));
    this.signupForm.addControl('table_name', this.fb.control("mailing_list"));
  }

  ngOnInit() {
    this.loadImage();
    this.imageUrl = this.dataService.getUploadURL();
  }

  async loadImage() {
    this.signupImage = await lastValueFrom(this.dataService.collectData("home-signup"));
  }

  async submit() {
    if (this.signupForm.invalid) {
      this.invalid = true;
      return;
    }

    await lastValueFrom(this.dataService.submitFormData(this.signupForm.value));
    this.submitted = true;
  }
}
