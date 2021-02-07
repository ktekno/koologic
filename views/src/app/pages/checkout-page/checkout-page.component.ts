import { Component, ElementRef, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { AppService } from '../../app.service'; 
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {

  isSmallMobileDevice: boolean = false;
  shippingFeeVal: number = 100;
  placeholder: string = "";
  payment_mode: string = "";
  address: string = "";
  city: string = "";
  province: string = "";
  zip: string = "";
  shipping_type: string = "";
  tosIsChecked: boolean = false;
  name: string = "";
  email: string = "";
  phone: string = "";
  voucherVal: number = 0;

  constructor(private _elementRef : ElementRef,
              private orderService: OrderService,
              public _appService: AppService,
              public authService: AuthService,
              private cartService: CartService,
              private router: Router,
              private route: ActivatedRoute, 
              private cookieService: CookieService,
              private spinner: NgxSpinnerService) { 

  }

  ngOnInit(): void {
    let _this = this;
    this._appService.path = "checkout";
    this.isSmallMobileDevice = window.matchMedia("(max-width: 969px)").matches
    window.matchMedia("(max-width: 969px)").addEventListener("change",(x: any): void => {
      if (x.matches) {
        _this.isSmallMobileDevice = window.matchMedia("(max-width: 969px)").matches;
      } else {
        _this.isSmallMobileDevice  = window.matchMedia("(max-width: 969px)").matches;
      }
    })
    this.spinner.show();
    this.authService.getUser().subscribe((credInfo: any)=>{
      this.name = credInfo.first_name + " " + credInfo.last_name;
      this.email = credInfo.email;
      this.phone = credInfo.billing.phone;
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
    });
    
    this.cartService.getPoints().subscribe(result => {
      if(result.success){
        if((result.points < (parseFloat(this.cookieService.get("points")) || 0)) && ((parseFloat(this.cookieService.get("points")) || 0) != 100 || (parseFloat(this.cookieService.get("points")) || 0) != 250 || (parseFloat(this.cookieService.get("points")) || 0) != 500)){
          _this.cookieService.remove("points"); 
          _this.voucherVal = 0;
        } else {
          _this.voucherVal = parseFloat(_this.cookieService.get("points")) || 0;
        }
      }
    }, error => {
      _this._elementRef.nativeElement.querySelector("#voucher").style.background = "#f8d7da";
    })
    
  }
  changePlaceholderValue(val: string, mode: string): void{
    this.payment_mode = mode;
    this.placeholder = val;
  }
  placeOrder(): void{
    let isValidInput = true;
    let orderInfo: any = {};
    if(!this.tosIsChecked){
      this._elementRef.nativeElement.querySelector("#tos-table").style.border = "2px solid red";
      this._elementRef.nativeElement.querySelector("#tos-table").scrollIntoView();
      isValidInput = false;
    } else {
      this._elementRef.nativeElement.querySelector("#tos-table").style.border = "none";
    }
    if(this.payment_mode == ""){
      this._elementRef.nativeElement.querySelector("#payment-info-holder").style.border = "2px solid red";
      this._elementRef.nativeElement.querySelector("#payment-info-holder").scrollIntoView();
      isValidInput = false;
    } else {
      this._elementRef.nativeElement.querySelector("#payment-info-holder").style.border = "none";
    }
    if(this.shipping_type == ""){
      this._elementRef.nativeElement.querySelector("#shipping-choice-table").style.border = "2px solid red";
      this._elementRef.nativeElement.querySelector("#shipping-choice-table").scrollIntoView();
      isValidInput = false;
    } else {
      this._elementRef.nativeElement.querySelector("#shipping-choice-table").style.border = "none";
    }
    if(this.zip == ""){
      this._elementRef.nativeElement.querySelector("#zip").style.background = "#f8d7da";
      this._elementRef.nativeElement.querySelector("#zip").scrollIntoView();
      isValidInput = false;
    } else {
      this._elementRef.nativeElement.querySelector("#zip").style.background = "white";
    }
    if(this.province == ""){
      this._elementRef.nativeElement.querySelector("#province").style.background = "#f8d7da";
      this._elementRef.nativeElement.querySelector("#province").scrollIntoView();
      isValidInput = false;
    } else {
      this._elementRef.nativeElement.querySelector("#province").style.background = "white";
    }
    if(this.city == ""){
      this._elementRef.nativeElement.querySelector("#city").style.background = "#f8d7da";
      this._elementRef.nativeElement.querySelector("#city").scrollIntoView();
      isValidInput = false;
    } else {
      this._elementRef.nativeElement.querySelector("#city").style.background = "white";
    }
    if(this.address == ""){
      this._elementRef.nativeElement.querySelector("#address").style.background = "#f8d7da";
      this._elementRef.nativeElement.querySelector("#address").scrollIntoView();
      isValidInput = false;
    } else {
      this._elementRef.nativeElement.querySelector("#address").style.background = "white";
    }
    orderInfo = {
      payment_method: this.payment_mode,
      payment_method_title: this.payment_mode,
      customer_id: this.cookieService.get('user_id'),
      billing: {
        address_1: this.address,
        address_2: "",
        city: this.city,
        state: this.province,
        postcode: this.zip,
        country: "PH"
      },
      shipping: {
        address_1: this.address,
        address_2: "",
        city: this.city,
        state: this.province,
        postcode: this.zip,
        country: "PH"
      },
      line_items:[],
      shipping_lines: [
        {
          method_id: this.shipping_type,
          method_title: this.shipping_type,
          total: this.shippingFeeVal.toString()
        }
      ]
    };
    this._appService.cart_contents.forEach(function(cart_content){
      orderInfo.line_items.push({
        product_id: cart_content.prod_id,
        quantity: cart_content.quantity
      });
    });
    console.log(orderInfo);

    if(isValidInput){
      let _this = this;
      if(this.voucherVal == 0){
        this.cookieService.remove("points");
      }
      this.cartService.clearCart().subscribe((response: any) => {
        if(response.success){
          _this.orderService.generateOrder(orderInfo).subscribe((orderResponse: any) => {
            _this.router.navigate(['order-received/'+orderResponse.order_id]);
          })
        }
      });
    }
  }

}
