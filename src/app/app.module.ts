import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { SlideshowComponent } from './components/slideshow/slideshow.component';
import { CategoryViewComponent } from './components/category-view/category-view.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { HomeCategoryRowComponent } from './components/home-category-row/home-category-row.component';
import { HomeTopProductsComponent } from './components/home-top-products/home-top-products.component';
import { HomeNewsletterSignupComponent } from './components/home-newsletter-signup/home-newsletter-signup.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ContactComponent,
    SlideshowComponent,
    CategoryViewComponent,
    CategoryListComponent,
    HomeCategoryRowComponent,
    HomeTopProductsComponent,
    HomeNewsletterSignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
