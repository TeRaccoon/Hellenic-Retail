import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { ShopComponent } from './components/shop/shop.component';
import { ViewComponent } from './components/view/view.component';
import { AccountComponent } from './components/account/account.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CreateAccountFormComponent } from './components/create-account-form/create-account-form.component';
import { OrderCompleteComponent } from './components/order-complete/order-complete.component';
import { AuthGuard } from './services/authguard.service';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
import { CartGuard } from './services/cartguard.service';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'shop/:category', component: ShopComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'view/:productName', component: ViewComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [CartGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'create-account', component: CreateAccountFormComponent },
  { path: 'order-complete', component: OrderCompleteComponent },
  { path: 'documents/:documentName', component: DocumentViewerComponent },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
