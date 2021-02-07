import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { NgxSpinnerModule } from "ngx-spinner";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxNumberSpinnerModule } from 'ngx-number-spinner';
import { CookieModule } from 'ngx-cookie';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ItemCarouselComponent } from './components/item-carousel/item-carousel.component';
import { CartComponent } from './components/cart/cart.component';
import { CartSummaryTableComponent } from './components/cart-summary-table/cart-summary-table.component'; 

import { HomePageComponent } from './pages/home-page/home.component';
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
import { TemplatePageComponent } from './pages/template-page/template-page.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { DiyPageComponent } from './pages/diy-page/diy-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ItemCarouselComponent,
    CartComponent,
    CartSummaryTableComponent,
    
    HomePageComponent,
    CartPageComponent,
    CheckoutPageComponent,
    OrderReceivedPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    UserInfoPageComponent,
    ProductDetailPageComponent,
    SearchResultPageComponent,
    ShowOrderPageComponent,
    OrderDetailsPageComponent,
    ForgotPasswordComponent,
    NotFoundComponent,
    TemplatePageComponent,
    CategoryPageComponent,
    DiyPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CarouselModule,
    CommonModule,
    FormsModule,
    NgxNumberSpinnerModule,
    NgxSpinnerModule,
    CookieModule.forRoot()
  ],
  providers: [
    CartComponent,
    AppService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
