import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPayPalModule } from 'ngx-paypal';

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
import { ViewImageComponent } from './components/view-image/view-image.component';
import { ViewDetailsComponent } from './components/view-details/view-details.component';
import { ViewRelatedComponent } from './components/view-related/view-related.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { CreateAccountFormComponent } from './components/create-account-form/create-account-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CartPopupComponent } from './components/cart-popup/cart-popup.component';
import { AccountComponent } from './components/account/account.component';
import { CheckoutCouponComponent } from './components/checkout-coupon/checkout-coupon.component';
import { CheckoutOrderSummaryComponent } from './components/checkout-order-summary/checkout-order-summary.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { PopupComponent } from './components/popup/popup.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { FooterComponent } from './components/footer/footer.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
import { OrderCompleteComponent } from './components/order-complete/order-complete.component';
import { AuthService } from './services/auth.service';
import { MobileNavbarComponent } from './components/mobile-navbar/mobile-navbar.component';
import { ProductComponent } from './components/product/product.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ViewDescriptionComponent } from './components/view-description/view-description.component';

export function initializeApp(
  authService: AuthService
): () => Promise<boolean> {
  return () => authService.checkLogin();
}

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
    NavbarCategorySearchComponent,
    ViewImageComponent,
    ViewDetailsComponent,
    ViewRelatedComponent,
    LoginFormComponent,
    CreateAccountFormComponent,
    CartPopupComponent,
    AccountComponent,
    CheckoutCouponComponent,
    CheckoutOrderSummaryComponent,
    CheckoutComponent,
    WishlistComponent,
    PopupComponent,
    ImageViewerComponent,
    FooterComponent,
    DocumentViewerComponent,
    OrderCompleteComponent,
    MobileNavbarComponent,
    ProductComponent,
    SafeHtmlPipe,
    ViewDescriptionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPayPalModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
