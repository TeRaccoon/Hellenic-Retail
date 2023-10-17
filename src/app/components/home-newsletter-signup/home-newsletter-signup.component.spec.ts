import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeNewsletterSignupComponent } from './home-newsletter-signup.component';

describe('HomeNewsletterSignupComponent', () => {
  let component: HomeNewsletterSignupComponent;
  let fixture: ComponentFixture<HomeNewsletterSignupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeNewsletterSignupComponent]
    });
    fixture = TestBed.createComponent(HomeNewsletterSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
