import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-show-order-page',
  templateUrl: './show-order-page.component.html',
  styleUrls: ['./show-order-page.component.css']
})
export class ShowOrderPageComponent implements OnInit {

  pageLengthHolder: any = [];
  current_page: number = 1;
  totalPages: number = 0;
  orderList: any;
  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private orderService: OrderService) { }

  ngOnInit(): void {
    let cp: any = this.route.snapshot.paramMap.get('page_num')? this.route.snapshot.paramMap.get('page_num') : "";
    let _this = this;
    this.current_page = parseInt(cp);
    this.spinner.show();
    this.orderService.getOrderList(this.current_page).subscribe((orderList: any)=>{
      _this.totalPages = parseInt(orderList.total_pages);
      _this.orderList = orderList.order_detail;
      _this.generateArrayForPages();
      _this.spinner.hide();
    });
  }

  generateArrayForPages(): void{
    this.pageLengthHolder = [];
    let basePage = this.current_page - (this.current_page%5 == 0? 5 : (this.current_page % 5)); // 5 - 5 =0
    for(let i = (basePage + 1) ; i <= basePage + 5 && i <= this.totalPages; i++){
      this.pageLengthHolder.push(i);
    }
  }

  computeQuantityTotal(line_items: any): number{
    return line_items.reduce((total: any, obj: any) => obj.quantity + total,0);
  }

  dateFormatter(date: string): string {
    return date.split("T")[0].replace("-","/").replace("-","/");
  }
  
}
