import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-details-page',
  templateUrl: './order-details-page.component.html',
  styleUrls: ['./order-details-page.component.css']
})
export class OrderDetailsPageComponent implements OnInit {

  ordered_contents: any = [];
  order_table: any = [];
  id: number = 0;
  order_date: string = "";
  shippingFeeVal: number = 100;
  first_name: string = "";
  last_name: string = "";
  payment_method_title: string = "";
  date_created: string = "";
  address: string = "";
  email: string = "";
  phone: string = "";
  status: string = "";
  items: any = [];
  partial_total: number = 0;
  total_price: string = "";
  shipping_lines: any = "";
  shipping_info: any = "";
  memo: any = "";

  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private orderService: OrderService) { }

  ngOnInit(): void {
    let _this = this;
    let id_param = this.route.snapshot.paramMap.get('id');
    this.id = parseInt(id_param == null? "0" : id_param);
    
    this.spinner.show();
    this.orderService.getOrder(this.id).subscribe((orderInfo: any)=>{
      _this.shipping_lines = orderInfo.order_detail.shipping_lines;
      _this.shipping_info = typeof orderInfo.order_detail.shipping_info != "undefined"? orderInfo.order_detail.shipping_info : [];
      _this.first_name = orderInfo.order_detail.billing.first_name;
      _this.last_name = orderInfo.order_detail.billing.last_name;
      _this.address = orderInfo.order_detail.billing.address_1 + " " + orderInfo.order_detail.billing.city + " " + orderInfo.order_detail.billing.state+ " " + orderInfo.order_detail.billing.postcode;
      _this.email = orderInfo.order_detail.billing.email;
      _this.phone = orderInfo.order_detail.billing.phone;
      _this.shippingFeeVal = parseFloat(orderInfo.order_detail.shipping_lines[0].total);
      _this.payment_method_title = orderInfo.order_detail.payment_method_title;
      _this.order_date = orderInfo.order_detail.date_created.split("T")[0].replace("-","/").replace("-","/");
      _this.status = orderInfo.order_detail.status;
      _this.items = orderInfo.order_detail.line_items;
      _this.partial_total = parseInt(orderInfo.order_detail.total) - _this.shippingFeeVal;
      _this.total_price = orderInfo.order_detail.total;
      _this.memo = orderInfo.order_detail.memo;
      
      this.spinner.hide();
    }, (error: any) => {

    });
  }

  cancelOrder(){
    this.spinner.show();
    this.orderService.cancelOrder(this.id).subscribe((orderInfo: any)=>{
      this.status = 'cancelled';
      this.spinner.hide();
    }, (error: any) => {
      console.log(error);
    });
    
  }

}
