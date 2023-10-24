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
import { HomeCategoryRowComponent } from './components/home-category-row/home-category-row.component';
import { HomeTopProductsComponent } from './components/home-top-products/home-top-products.component';
import { HomeNewsletterSignupComponent } from './components/home-newsletter-signup/home-newsletter-signup.component';
import { HomeCardSectionAComponent } from './components/home-card-section-a/home-card-section-a.component';
import { HomeFeaturedComponent } from './components/home-featured/home-featured.component';
import { ShopComponent } from './components/shop/shop.component';
import { PageBannerComponent } from './components/page-banner/page-banner.component';
import { ShopSidebarComponent } from './components/shop-sidebar/shop-sidebar.component';
import { ShopGridComponent } from './components/shop-grid/shop-grid.component';
import { ViewComponent } from './components/view/view.component';
import { NavbarCategorySearchComponent } from './components/navbar-category-search/navbar-category-search.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ContactComponent,
    SlideshowComponent,
    HomeCategoryRowComponent,
    HomeTopProductsComponent,
    HomeNewsletterSignupComponent,
    HomeCardSectionAComponent,
    HomeFeaturedComponent,
    ShopComponent,
    PageBannerComponent,
    ShopSidebarComponent,
    ShopGridComponent,
    ViewComponent,
    NavbarCategorySearchComponent
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
