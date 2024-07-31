import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UrlService } from 'src/app/services/url.service'
import { lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormService } from 'src/app/services/form.service';

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
  signedUp = false;

  faCheck = faCheck;

  constructor(private urlService: UrlService, private dataService: DataService, private fb: FormBuilder, private formService: FormService) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.signupForm.addControl('action', this.fb.control('add'));
    this.signupForm.addControl('table_name', this.fb.control("mailing_list"));
  }

  ngOnInit() {
    this.loadImage();
    this.imageUrl = this.urlService.getUrl('uploads');;
  }

  async loadImage() {
    this.signupImage = await lastValueFrom(this.dataService.collectData("home-signup"));
  }

  async submit() {
    if (this.signupForm.invalid) {
      this.formService.setPopupMessage("Please enter a valid email!");
      this.formService.showPopup();
      this.invalid = true;
      return;
    }

    let response = await lastValueFrom(this.dataService.submitFormData(this.signupForm.value));
    if (response.success) {
      this.signedUp = true;
      this.formService.setPopupMessage("Signed up successfully!");
    } else {
      this.formService.setPopupMessage("You are already signed up!")
    }
    this.formService.showPopup();
  }
}
