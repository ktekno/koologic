import { Component, ElementRef, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { AppService } from '../../app.service'; 
import { CartService } from '../../services/cart.service';
import { provinces, regions } from 'ph-locations';
import { error } from 'protractor';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {

  isSmallMobileDevice: boolean = false;
  shippingFeeVal: number = 0;
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
  ref_number: string = "";
  memo: string = "";
  province_list: any = [];//provinces;

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

    if(this._appService.cart_contents.length == 0){
      this.router.navigate(['cart/']);
    }
    this.province_list = [{
      altName: null,
      code: "PH-NCR",
      name: "National Capital Region",
      nameTL: "Pambansang Punong Rehiyon",
      region: "PH-00"
    }, {
      altName: null,
      code: "PH-CAV",
      name: "Cavite",
      nameTL: "Kabite",
      region: "PH-40"
    }, {
      altName: null,
      code: "PH-LAG",
      name: "Laguna",
      nameTL: "Laguna",
      region: "PH-40"
    }, {
      altName: null,
      code: "PH-RIZ",
      name: "Rizal",
      nameTL: "Rizal",
      region: "PH-40"
    }];
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

  computeSf(){
      let isValidInput = true;
      let weight_total = 0;
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
      if(!isValidInput){
        this.shipping_type = "shipping3";
        return;
      }
      if(this.shipping_type == "shipping2"){
        this._appService.cart_contents.forEach(function(cart_content){
            weight_total += parseFloat(cart_content.weight) * parseFloat(cart_content.quantity);
        });
        this.spinner.show();
        this.cartService.getSf("mr_speedy",{
            matter:"Gadgets",
            is_client_notification_enabled: true,
            is_route_optimizer_enabled: true,
            vehicle_type_id: 8,
            total_weight_kg: weight_total,
            points: [{
                "address": "70 Jasmine, St. Lodora Village, Brgy Tunasan, Muntinlupa, NCR"
            },{
                "address": this.address + ", " + this.city + ", " + this.province
            }]
        }).subscribe((result: any)=>{
          this.spinner.hide();
          if(result.is_successful){
            this.shippingFeeVal = parseFloat(result.order.delivery_fee_amount);
          } else {
            this.shipping_type = "shipping3";
          }
        }, error =>{
          this.shipping_type = "shipping3";
          this.spinner.hide();
        });
    }
  }

  placeOrder(): void{
    let isValidInput = true;
    let orderInfo: any = {};
    let total_weight = 0;
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
    if(this.payment_mode == "gcash"){
      if(this.ref_number.match(/[0-9]{9,14}/gi) == null){
        this._elementRef.nativeElement.querySelector("#payment-ref").style.background = "#f8d7da";
        this._elementRef.nativeElement.querySelector("#payment-ref").scrollIntoView();
        isValidInput = false;
      } else {
        this._elementRef.nativeElement.querySelector("#payment-ref").style.background = "white";
      }
    } 
    if(this.payment_mode == "paypal"){
      if(this.ref_number.match(/[0-9A-Z]{17}/gi) == null){
        this._elementRef.nativeElement.querySelector("#payment-ref").style.background = "#f8d7da";
        this._elementRef.nativeElement.querySelector("#payment-ref").scrollIntoView();
        isValidInput = false;
      } else {
        this._elementRef.nativeElement.querySelector("#payment-ref").style.background = "white";
      }
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
          method_title: this.shipping_type == "shipping2"? "Mr Speedy" : this.shipping_type == "shipping1"? "Lalamove" : "Meetup",
          total: this.shippingFeeVal.toString()
        }
      ],
      meta_data: [{
        key: "ref_no",
        value: this.ref_number
      },{
        key: "memo",
        value: this.memo
      }]
    };
    this._appService.cart_contents.forEach(function(cart_content){
      orderInfo.line_items.push({
        product_id: cart_content.prod_id,
        quantity: cart_content.quantity
      });
      total_weight += (parseFloat(cart_content.quantity)*cart_content.weight);
    });
    orderInfo.meta_data.push({
      key: "weight",
      value: total_weight
    });

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
