import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-home-newsletter-signup',
  templateUrl: './home-newsletter-signup.component.html',
  styleUrls: ['./home-newsletter-signup.component.scss']
})
export class HomeNewsletterSignupComponent {
  signupImage: any;

  constructor(private dataService: DataService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loadImage();
  }
  loadImage() {
    this.dataService.collectData("home-signup").subscribe((data: any) => {
      this.signupImage = data;
    });
  }

  getBackgroundImage(signupImage: string): SafeStyle {
    const imageUrl = 'assets/uploads/admin_uploads/' + signupImage;
    return this.sanitizer.bypassSecurityTrustStyle(`url(${imageUrl})`);
  }
}
