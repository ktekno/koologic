import { Component, ElementRef, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';

import { AppService } from '../../app.service'; 
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-received-page',
  templateUrl: './order-received-page.component.html',
  styleUrls: ['./order-received-page.component.css']
})
export class OrderReceivedPageComponent implements OnInit {

  isSmallMobileDevice: boolean = false;
  ordered_contents: any = [];
  order_table: any = [];
  id: number = 0;
  shippingFeeVal: number = 100;
  first_name: string = "";
  last_name: string = "";
  payment_method_title: string = "";
  date_created: string = "";
  address: string = "";
  email: string = "";
  phone: string = "";
  voucherVal: number = 0;

  constructor(private _elementRef : ElementRef,
              private route: ActivatedRoute, 
              private spinner: NgxSpinnerService,
              private orderService: OrderService,
              public _appService: AppService) {
    this.isSmallMobileDevice = window.matchMedia("(max-width: 900px)").matches;
  }

  ngOnInit(): void {
    let _this = this;
    let id_param = this.route.snapshot.paramMap.get('id');
    this.id = parseInt(id_param == null? "0" : id_param);
    
    this.spinner.show();
    this.orderService.getOrder(this.id).subscribe((orderInfo: any)=>{
      _this.first_name = orderInfo.order_detail.billing.first_name;
      _this.last_name = orderInfo.order_detail.billing.last_name;
      _this.address = orderInfo.order_detail.billing.address_1 + " " + orderInfo.order_detail.billing.city + " " + orderInfo.order_detail.billing.state+ " " + orderInfo.order_detail.billing.postcode;
      _this.email = orderInfo.order_detail.billing.email;
      _this.phone = orderInfo.order_detail.billing.phone;
      _this.shippingFeeVal = parseFloat(orderInfo.order_detail.shipping_lines[0].total);
      _this.payment_method_title = orderInfo.order_detail.payment_method_title;
      _this.voucherVal = orderInfo.order_detail.coupon_lines.length == 1? parseFloat(orderInfo.order_detail.coupon_lines[0].discount) : 0;
      orderInfo.order_detail.line_items.forEach(function(od: any){
        _this.ordered_contents.push({
          discountBadge: od.sale_price != ""? "Sale " + ((parseFloat(od.regular_price) - parseFloat(od.sale_price))*100/parseFloat(od.regular_price)) + "% off" : "",
          imgSrc: od.images[0].src,
          regularPrice: parseFloat(od.subtotal)/parseFloat(od.quantity),
          discountedPrice: od.sale_price,
          priceBadge: od.subtotal ,
          titleSpecs: od.name,
          quantity: od.quantity,
          subSpecs: ``,
          url: "/"

        });
        _this.order_table.push({
          imgSrc: od.images[0].src,
          regularPrice: od.sale_price != ""? od.sale_price : parseFloat(od.subtotal)/parseFloat(od.quantity),
          discountedPrice: od.sale_price,
          priceBadge: od.subtotal,
          titleSpecs: od.name,
          quantity: od.quantity
        })
      })
      
      this.spinner.hide();
      this._appService.refreshCart();
    }, (error: any) => {

    });
    
  }

}
