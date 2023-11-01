import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from '../../services/form.service';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  changeAccountDetails: FormGroup;
  loggedIn: boolean | null = null;
  userData: any;
  edit = false;

  constructor(private dataService: DataService, private formService: FormService, private authService: AuthService, private fb: FormBuilder) {
    this.changeAccountDetails = this.fb.group({
      
    })
  }

  ngOnInit() {
    this.authService.isLoggedIn().subscribe((data) => {
      this.loggedIn = data;
      if (!data) {
        this.formService.showLoginForm();
      }
    });
    this.loadAccountDetails();
  }
  async loadAccountDetails() {
    this.authService.getUserID().subscribe((data) => {
      const userID = data;
      if (userID != null) {
        this.dataService.collectData('user-details', userID.toString()).subscribe((userData: any) => {
          this.userData = userData;
        });
      }
    });
  }
  toggleEdit() {
    this.edit = !this.edit;
  }
  cancelEdit() {
    this.edit = false;
  }
}
