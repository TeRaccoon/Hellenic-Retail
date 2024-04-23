import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss']
})
export class CreateAccountFormComponent {
  registrationForm: FormGroup;
  submitted = false;
  error = "";

  subscribe = false;
  agreedToTerms = false;

  constructor(private router: Router, private dataService: DataService, private formService: FormService, private formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      forename: ['', Validators.required],
      surname: ['', Validators.required],
      phone_number_primary: ['', [Validators.required, Validators.pattern(/^\+?\d{1,3}[- ]?\d{3,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address_line_1: ['', Validators.required],
      address_line_2: [''],
      address_line_3: [''],
      postcode: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRepeat: ['', Validators.required],
      action: ['add'],
      table_name: ['customers']
    });
  }

  ngOnInit() {
    this.submitted = false;
    this.error = "";

    this.formService.setBannerMessage("Create Account");
  }

  passwordsMatch(): boolean {
    const password = this.registrationForm.get('password')?.value;
    const passwordRepeat = this.registrationForm.get('passwordRepeat')?.value;
    return password === passwordRepeat;
  }

  onSubmit() {
    this.submitted = true;
    let passwordsMatch = this.passwordsMatch()
    if (this.registrationForm.valid && passwordsMatch) {
      this.submitForm();
    } else {
      if (!passwordsMatch) {
        this.error = "Your passwords do not match!";
      } else {
        this.error = "Please fill in the required fields!"
      }
    }
  }

  async submitForm() {
    if (this.registrationForm.valid) {
      if (this.agreedToTerms) {
        const formData = { ...this.registrationForm.value };
        delete formData.passwordRepeat;
    
        let passed = await this.preSubmissionChecks();
        if (passed) {
          let response = await lastValueFrom(this.dataService.submitFormData(formData));
          if (response.success) {
            this.formService.setPopupMessage("Account Created Successfully!");
            if (this.subscribe) {
              response = await this.subscribeToNewsletter();
              if (!response.success) {
                this.formService.setPopupMessage("There was an issue subscribing you to the newsletter!");
              }
            }
            this.formService.showPopup();
            setTimeout(() => {
              this.router.navigate(['/account']);
            }, 3000);
    
          } else {
            this.error = "There was an issue creating your account. Please double check your details!";
          }
        }
      } else {
        this.error = "Please agree to the terms and conditions!";
      }
    }
  }

  async subscribeToNewsletter() {
    const formData = {
      email: this.registrationForm.get('email')!.value,
      action: 'add',
      table_name: 'mailing_list',
    };
    let response = await lastValueFrom(this.dataService.submitFormData(formData));
    return response;
  }

  async preSubmissionChecks() {
    let userIDs = await lastValueFrom(this.dataService.collectData("user-id-from-email", this.registrationForm.get('email')?.value));
    if (userIDs.length === 0) {
      return true;
    } else {
      this.error = "This email address has already been registered!";
    }
    return false;
  }

  inputHasError(field: string) {
    return this.registrationForm.get(field)?.invalid && this.submitted;
  }

  onPromoCheckboxChange(event: any) {
    this.subscribe = event.target.checked;
  }

  onTermsCheckboxChange(event: any) {
    this.agreedToTerms = event.target.checked;
  }
}
