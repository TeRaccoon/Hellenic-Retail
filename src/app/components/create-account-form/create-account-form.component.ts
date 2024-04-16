import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private dataService: DataService, private formService: FormService, private formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      forename: ['', Validators.required],
      surname: ['', Validators.required],
      phoneNumber: ['', Validators.required, Validators.pattern('[0-9]+')],
      email: ['', [Validators.required, Validators.email]],
      addressLineOne: ['', Validators.required],
      addressLineTwo: [''],
      addressLineThree: [''],
      postcode: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordRepeat: ['', Validators.required],
      action: ['add'],
      table: ['customers']
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
    let response = await lastValueFrom(this.dataService.submitFormData(this.registrationForm.value));
    if (response.success) {
      this.formService.setPopupMessage("Account Created Successfully!");
      this.formService.showPopup();
    } else {

    }
  }

  inputHasError(field: string) {
    return this.registrationForm.get(field)?.invalid && this.submitted;
  }
}
