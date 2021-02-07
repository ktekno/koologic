import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from  './auth/auth.guard';

import { HomePageComponent } from './pages/home-page/home.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { OrderReceivedPageComponent } from './pages/order-received-page/order-received-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { UserInfoPageComponent } from './pages/user-info-page/user-info-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';
import { SearchResultPageComponent } from './pages/search-result-page/search-result-page.component';
import { ShowOrderPageComponent } from './pages/show-order-page/show-order-page.component';
import { OrderDetailsPageComponent } from './pages/order-details-page/order-details-page.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DiyPageComponent } from './pages/diy-page/diy-page.component';
import { TemplatePageComponent } from './pages/template-page/template-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home' , component: HomePageComponent },
  { path: 'cart' , component: CartPageComponent },
  { path: 'checkout' , component: CheckoutPageComponent, canActivate: [AuthGuard]  },
  { path: 'order-received/:id' , component: OrderReceivedPageComponent, canActivate: [AuthGuard] },
  { path: 'login' , component: LoginPageComponent },
  { path: 'forgot-password' , component: ForgotPasswordComponent },
  { path: 'register' , component: RegisterPageComponent },
  { path: 'user-info' , component: UserInfoPageComponent, canActivate: [AuthGuard]  },
  { path: 'product/:slug' , component: ProductDetailPageComponent },
  { path: 'search-result/:keyword' , component: SearchResultPageComponent },
  { path: 'category/:category' , component: CategoryPageComponent },
  { path: 'show-orders/:page_num' , component: ShowOrderPageComponent, canActivate: [AuthGuard]  },
  { path: 'order-details/:id' , component: OrderDetailsPageComponent, canActivate: [AuthGuard]  },
  { path: 'diy-page' , component: DiyPageComponent },
  { path: ':template' , component: TemplatePageComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
