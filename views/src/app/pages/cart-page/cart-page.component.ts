import { Component, ElementRef, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { NgxSpinnerService } from "ngx-spinner";

import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../app.service'; 

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  isAuthenticated: boolean = false;
  currentPoints: number = 0;
  voucherVal: number = 0;
  constructor(private _elementRef : ElementRef, 
              public _appService: AppService,
              public cartService: CartService,
              public authService: AuthService, 
              private cookieService: CookieService, 
              private spinner: NgxSpinnerService) { 
    
  }
  
  change(value: number, index: number): void {
      this._appService.cart_contents[index].quantity = value;
      this._appService.cart_contents[index].priceBadge = value * parseFloat(this._appService.cart_contents[index].discountedPrice);
      this._appService.updateCartChanges(this._appService.cart_contents[index]);
  }

  ngOnInit(): void {
    this._appService.path = "cart";
    this.authService.isAuthenticated().then((response: any) => {
      this.isAuthenticated = response.success;
      if(this.isAuthenticated){
        this.spinner.show();
        this.authService.getUser().subscribe((response: any) => {
          let points_index = response.meta_data.findIndex((r: any)=> r.key == "points");
          this.currentPoints = points_index > -1? parseFloat(response.meta_data[points_index].value) || 0 : 0;
          this.spinner.hide();
        }, error => {
          console.log(error);
          this.spinner.hide();
        })
      }
    }).catch((error)=>{
      console.log(error)
    });
  }

  deleteFromCart(index: number): void{
    this._appService.removeFromCart(index);
  }

  getQuantityTotal(): number {
    return this._appService.cart_contents.reduce(function(prev: any, cur: any) {return parseFloat(prev) + parseFloat(cur.quantity);}, 0)
  }

  getPriceTotal(): number {
    return this._appService.cart_contents.reduce(function(prev: any, cur: any) {return parseFloat(prev) + parseFloat(cur.priceBadge);}, 0)
  }

  getPoints(): void {
    let _this = this;
    console.log(_this._elementRef.nativeElement.querySelector("#voucher").value);
    if(!_this._elementRef.nativeElement.querySelector("#voucher").value.toLowerCase().startsWith("kl")){
      _this._elementRef.nativeElement.querySelector("#voucher").style.background = "#f8d7da";
      return;
    }
    if(this.isAuthenticated){
      this.cartService.getPoints().subscribe(result => {
        if(result.success){
          let vVal = _this._elementRef.nativeElement.querySelector("#voucher").value.toLowerCase().replace("kl", "");
          if((result.points < (parseFloat(vVal) || 0)) && (vVal != 100 || vVal != 250 || vVal != 500)){
            _this._elementRef.nativeElement.querySelector("#voucher").style.background = "#f8d7da";  
          } else {
            _this._elementRef.nativeElement.querySelector("#voucher").style.background = "#90EE90";
            _this.voucherVal = (parseInt(_this._elementRef.nativeElement.querySelector("#voucher").value.toLowerCase().replace("kl", "")) || 0)
            this.cookieService.put("points",  (parseInt(_this._elementRef.nativeElement.querySelector("#voucher").value.toLowerCase().replace("kl", "")) || 0).toString())
          }
        }
      }, error => {
        _this._elementRef.nativeElement.querySelector("#voucher").style.background = "#f8d7da";
      })
    }
  }
}
